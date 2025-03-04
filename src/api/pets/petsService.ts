import { supabase } from "@/lib/supabase";
import { Pet, CreatePetRequest, UpdatePetRequest, PetFilters } from "./types";
import { getCurrentUser, hasRole, isResourceOwner } from "../auth/authService";
import { cacheService } from "../cache/cacheService";

// Función de ayuda para transformar el objeto crudo en el tipo Pet
function transformPet(pet: any): Pet {
  return {
    ...pet,
    // Si 'age' viene como string, lo convertimos a number
    age: typeof pet.age === "string" ? Number(pet.age) : pet.age,
    // Propiedades faltantes: se asigna un valor por defecto si no existen
    owner_name: pet.owner_name || "",
    owner_email: pet.owner_email || "",
    // Usamos 'location' si existe, de lo contrario 'last_seen_location' o vacío
    location: pet.location || pet.last_seen_location || "",
    coordinates: pet.coordinates || "",
    // Si 'reported_date' no existe, usamos 'created_at'
    reported_date: pet.reported_date || pet.created_at || "",
  };
}

/**
 * Obtiene todas las mascotas con filtrado opcional.
 */
export async function getPets(filters: PetFilters = {}): Promise<Pet[]> {
  try {
    const cacheKey = `pets_${JSON.stringify(filters)}`;

    return await cacheService.getOrCompute(
      cacheKey,
      async () => {
        let query = supabase.from("pets").select("*");

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
        if (filters.limit) {
          query = query.limit(filters.limit);
        }
        if (filters.offset) {
          query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
        }
        query = query.order("reported_date", { ascending: false });

        const { data, error } = await query;
        if (error) throw error;

        return (data as any[]).map(transformPet);
      },
      60000,
    );
  } catch (error) {
    console.error("Error fetching pets:", error);
    throw error;
  }
}

/**
 * Obtiene una mascota por su ID.
 */
export async function getPetById(id: string): Promise<Pet> {
  if (!id) throw new Error("Pet ID is required");

  try {
    const cacheKey = `pet_${id}`;
    return await cacheService.getOrCompute(
      cacheKey,
      async () => {
        const { data, error } = await supabase
          .from("pets")
          .select("*")
          .eq("id", id)
          .single();
        if (error) throw error;
        if (!data) throw new Error(`Pet with ID ${id} not found`);
        return transformPet(data);
      },
      300000,
    );
  } catch (error) {
    console.error(`Error fetching pet with ID ${id}:`, error);
    throw error;
  }
}

/**
 * Crea una nueva mascota.
 * Requiere autenticación.
 */
export async function createPet(petData: CreatePetRequest): Promise<Pet> {
  if (!petData) throw new Error("Pet data is required");

  try {
    const user = await getCurrentUser();
    if (!user) throw new Error("Authentication required");

    if (!petData.name || !petData.breed || !petData.location) {
      throw new Error("Missing required fields");
    }

    const newPet = {
      ...petData,
      owner_id: user.id,
      reported_date: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("pets")
      .insert([newPet])
      .select()
      .single();
    if (error) throw error;
    if (!data) throw new Error("Failed to create pet record");

    // Inserción en audit_logs (casting a any para evitar problemas de tipos)
    await (supabase as any).from("audit_logs").insert([
      {
        user_id: user.id,
        action: "create",
        table_name: "pets",
        record_id: data.id,
        new_values: data,
      },
    ]);

    // Limpiar caché de listados de mascotas
    Object.keys(cacheService.getKeys()).forEach((key) => {
      if (key.startsWith("pets_")) {
        cacheService.remove(key);
      }
    });

    return transformPet(data);
  } catch (error) {
    console.error("Error creating pet:", error);
    throw error;
  }
}

/**
 * Actualiza una mascota existente.
 * Requiere autenticación y propiedad o rol admin/moderator.
 */
export async function updatePet(
  id: string,
  petData: UpdatePetRequest,
): Promise<Pet> {
  if (!id || !petData) throw new Error("Pet ID and update data are required");

  try {
    const user = await getCurrentUser();
    if (!user) throw new Error("Authentication required");

    const isOwner = await isResourceOwner("pets", id);
    const isModerator = await hasRole("moderator");
    if (!isOwner && !isModerator) {
      throw new Error("You don't have permission to update this pet");
    }

    const { data: oldPet, error: fetchError } = await supabase
      .from("pets")
      .select("*")
      .eq("id", id)
      .single();
    if (fetchError) throw fetchError;
    if (!oldPet) throw new Error(`Pet with ID ${id} not found`);

    const updateData = { ...petData, updated_at: new Date().toISOString() };

    const { data, error } = await supabase
      .from("pets")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    if (!data) throw new Error(`Failed to update pet with ID ${id}`);

    await (supabase as any).from("audit_logs").insert([
      {
        user_id: user.id,
        action: "update",
        table_name: "pets",
        record_id: id,
        old_values: oldPet,
        new_values: data,
      },
    ]);

    cacheService.remove(`pet_${id}`);
    Object.keys(cacheService.getKeys()).forEach((key) => {
      if (key.startsWith("pets_")) {
        cacheService.remove(key);
      }
    });

    return transformPet(data);
  } catch (error) {
    console.error(`Error updating pet with ID ${id}:`, error);
    throw error;
  }
}

/**
 * Elimina una mascota.
 * Requiere autenticación y propiedad o rol admin.
 */
export async function deletePet(id: string): Promise<boolean> {
  if (!id) throw new Error("Pet ID is required");

  try {
    const user = await getCurrentUser();
    if (!user) throw new Error("Authentication required");

    const isOwner = await isResourceOwner("pets", id);
    const isAdmin = await hasRole("admin");
    if (!isOwner && !isAdmin) {
      throw new Error("You don't have permission to delete this pet");
    }

    const { data: oldPet, error: fetchError } = await supabase
      .from("pets")
      .select("*")
      .eq("id", id)
      .single();
    if (fetchError) throw fetchError;
    if (!oldPet) throw new Error(`Pet with ID ${id} not found`);

    const { error } = await supabase.from("pets").delete().eq("id", id);
    if (error) throw error;

    await (supabase as any).from("audit_logs").insert([
      {
        user_id: user.id,
        action: "delete",
        table_name: "pets",
        record_id: id,
        old_values: oldPet,
      },
    ]);

    cacheService.remove(`pet_${id}`);
    Object.keys(cacheService.getKeys()).forEach((key) => {
      if (key.startsWith("pets_")) {
        cacheService.remove(key);
      }
    });

    return true;
  } catch (error) {
    console.error(`Error deleting pet with ID ${id}:`, error);
    throw error;
  }
}

/**
 * Bloquea una mascota (solo admin/moderator).
 */
export async function blockPet(id: string): Promise<Pet> {
  try {
    const isModerator = await hasRole("moderator");
    if (!isModerator) throw new Error("You don't have permission to block pets");
    return await updatePet(id, { status: "blocked" });
  } catch (error) {
    console.error(`Error blocking pet with ID ${id}:`, error);
    throw error;
  }
}

/**
 * Desbloquea una mascota (solo admin/moderator).
 */
export async function unblockPet(
  id: string,
  originalStatus: "lost" | "found" = "lost",
): Promise<Pet> {
  try {
    const isModerator = await hasRole("moderator");
    if (!isModerator) throw new Error("You don't have permission to unblock pets");
    return await updatePet(id, { status: originalStatus });
  } catch (error) {
    console.error(`Error unblocking pet with ID ${id}:`, error);
    throw error;
  }
}