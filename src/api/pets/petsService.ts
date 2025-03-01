import { supabase } from "@/lib/supabase";
import { Pet, CreatePetRequest, UpdatePetRequest, PetFilters } from "./types";
import { getCurrentUser, hasRole, isResourceOwner } from "../auth/authService";

/**
 * Get all pets with optional filtering
 */
export async function getPets(filters: PetFilters = {}): Promise<Pet[]> {
  try {
    let query = supabase.from("pets").select("*");

    // Apply filters
    if (filters.status) {
      query = query.eq("status", filters.status);
    }

    if (filters.type) {
      query = query.eq("type", filters.type);
    }

    if (filters.breed) {
      query = query.ilike("breed", `%${filters.breed}%`);
    }

    if (filters.location) {
      query = query.ilike("location", `%${filters.location}%`);
    }

    if (filters.owner_id) {
      query = query.eq("owner_id", filters.owner_id);
    }

    if (filters.reported_after) {
      query = query.gte("reported_date", filters.reported_after);
    }

    if (filters.reported_before) {
      query = query.lte("reported_date", filters.reported_before);
    }

    // Pagination
    if (filters.limit) {
      query = query.limit(filters.limit);
    }

    if (filters.offset) {
      query = query.range(
        filters.offset,
        filters.offset + (filters.limit || 10) - 1,
      );
    }

    // Order by most recent first
    query = query.order("reported_date", { ascending: false });

    const { data, error } = await query;

    if (error) throw error;

    return data as Pet[];
  } catch (error) {
    console.error("Error fetching pets:", error);
    throw error;
  }
}

/**
 * Get a single pet by ID
 */
export async function getPetById(id: string): Promise<Pet> {
  try {
    const { data, error } = await supabase
      .from("pets")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;

    return data as Pet;
  } catch (error) {
    console.error(`Error fetching pet with ID ${id}:`, error);
    throw error;
  }
}

/**
 * Create a new pet
 * Requires authentication
 */
export async function createPet(petData: CreatePetRequest): Promise<Pet> {
  try {
    // Get current user
    const user = await getCurrentUser();
    if (!user) {
      throw new Error("Authentication required");
    }

    // Prepare pet data with owner information
    const newPet = {
      ...petData,
      owner_id: user.id,
      reported_date: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Insert into database
    const { data, error } = await supabase
      .from("pets")
      .insert([newPet])
      .select()
      .single();

    if (error) throw error;

    // Create audit log
    await supabase.from("audit_logs").insert([
      {
        user_id: user.id,
        action: "create",
        table_name: "pets",
        record_id: data.id,
        new_values: data,
      },
    ]);

    return data as Pet;
  } catch (error) {
    console.error("Error creating pet:", error);
    throw error;
  }
}

/**
 * Update an existing pet
 * Requires authentication and ownership or admin/moderator role
 */
export async function updatePet(
  id: string,
  petData: UpdatePetRequest,
): Promise<Pet> {
  try {
    // Get current user
    const user = await getCurrentUser();
    if (!user) {
      throw new Error("Authentication required");
    }

    // Check if user is owner or has admin/moderator role
    const isOwner = await isResourceOwner("pets", id);
    const isModerator = await hasRole("moderator");

    if (!isOwner && !isModerator) {
      throw new Error("You don't have permission to update this pet");
    }

    // Get the current pet data for audit log
    const { data: oldPet, error: fetchError } = await supabase
      .from("pets")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError) throw fetchError;

    // Prepare update data
    const updateData = {
      ...petData,
      updated_at: new Date().toISOString(),
    };

    // Update in database
    const { data, error } = await supabase
      .from("pets")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    // Create audit log
    await supabase.from("audit_logs").insert([
      {
        user_id: user.id,
        action: "update",
        table_name: "pets",
        record_id: id,
        old_values: oldPet,
        new_values: data,
      },
    ]);

    return data as Pet;
  } catch (error) {
    console.error(`Error updating pet with ID ${id}:`, error);
    throw error;
  }
}

/**
 * Delete a pet
 * Requires authentication and ownership or admin role
 */
export async function deletePet(id: string): Promise<boolean> {
  try {
    // Get current user
    const user = await getCurrentUser();
    if (!user) {
      throw new Error("Authentication required");
    }

    // Check if user is owner or has admin role
    const isOwner = await isResourceOwner("pets", id);
    const isAdmin = await hasRole("admin");

    if (!isOwner && !isAdmin) {
      throw new Error("You don't have permission to delete this pet");
    }

    // Get the current pet data for audit log
    const { data: oldPet, error: fetchError } = await supabase
      .from("pets")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError) throw fetchError;

    // Delete from database
    const { error } = await supabase.from("pets").delete().eq("id", id);

    if (error) throw error;

    // Create audit log
    await supabase.from("audit_logs").insert([
      {
        user_id: user.id,
        action: "delete",
        table_name: "pets",
        record_id: id,
        old_values: oldPet,
      },
    ]);

    return true;
  } catch (error) {
    console.error(`Error deleting pet with ID ${id}:`, error);
    throw error;
  }
}

/**
 * Block a pet (admin/moderator only)
 */
export async function blockPet(id: string): Promise<Pet> {
  try {
    // Check if user has moderator or admin role
    const isModerator = await hasRole("moderator");
    if (!isModerator) {
      throw new Error("You don't have permission to block pets");
    }

    return await updatePet(id, { status: "blocked" });
  } catch (error) {
    console.error(`Error blocking pet with ID ${id}:`, error);
    throw error;
  }
}

/**
 * Unblock a pet (admin/moderator only)
 */
export async function unblockPet(
  id: string,
  originalStatus: "lost" | "found" = "lost",
): Promise<Pet> {
  try {
    // Check if user has moderator or admin role
    const isModerator = await hasRole("moderator");
    if (!isModerator) {
      throw new Error("You don't have permission to unblock pets");
    }

    return await updatePet(id, { status: originalStatus });
  } catch (error) {
    console.error(`Error unblocking pet with ID ${id}:`, error);
    throw error;
  }
}
