import {
  Pet,
  CreatePetRequest,
  UpdatePetRequest,
  PetResponse,
  PetsResponse,
  PetError,
  PetFilters,
} from "./types";
import { getAuthToken } from "../auth/authService";

const API_URL = import.meta.env.VITE_API_URL || "";

/**
 * Helper function to handle API errors
 */
async function handleApiError(response: Response): Promise<PetError> {
  let errorData: any = { error: "Unknown error", status: response.status };

  try {
    errorData = await response.json();
  } catch (e) {
    errorData.error = response.statusText || "Unknown error";
  }

  return errorData as PetError;
}

/**
 * Get all pets with optional filtering
 */
export async function fetchPets(
  filters: PetFilters = {},
): Promise<PetsResponse> {
  try {
    // Build query string from filters
    const queryParams = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (typeof value === "object") {
          queryParams.append(key, JSON.stringify(value));
        } else {
          queryParams.append(key, value.toString());
        }
      }
    });

    const queryString = queryParams.toString()
      ? `?${queryParams.toString()}`
      : "";

    const response = await fetch(`${API_URL}/api/pets${queryString}`);

    if (!response.ok) {
      throw await handleApiError(response);
    }

    const data = await response.json();
    return data as PetsResponse;
  } catch (error) {
    console.error("Error fetching pets:", error);
    throw error;
  }
}

/**
 * Get a single pet by ID
 */
export async function fetchPetById(id: string): Promise<PetResponse> {
  try {
    const response = await fetch(`${API_URL}/api/pets/${id}`);

    if (!response.ok) {
      throw await handleApiError(response);
    }

    const data = await response.json();
    return data as PetResponse;
  } catch (error) {
    console.error(`Error fetching pet with ID ${id}:`, error);
    throw error;
  }
}

/**
 * Create a new pet
 * Requires authentication
 */
export async function createPetApi(
  petData: CreatePetRequest,
): Promise<PetResponse> {
  try {
    const token = await getAuthToken();
    if (!token) {
      throw { error: "Authentication required", status: 401 };
    }

    const response = await fetch(`${API_URL}/api/pets`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(petData),
    });

    if (!response.ok) {
      throw await handleApiError(response);
    }

    const data = await response.json();
    return data as PetResponse;
  } catch (error) {
    console.error("Error creating pet:", error);
    throw error;
  }
}

/**
 * Update an existing pet
 * Requires authentication and ownership or admin/moderator role
 */
export async function updatePetApi(
  id: string,
  petData: UpdatePetRequest,
): Promise<PetResponse> {
  try {
    const token = await getAuthToken();
    if (!token) {
      throw { error: "Authentication required", status: 401 };
    }

    const response = await fetch(`${API_URL}/api/pets/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(petData),
    });

    if (!response.ok) {
      throw await handleApiError(response);
    }

    const data = await response.json();
    return data as PetResponse;
  } catch (error) {
    console.error(`Error updating pet with ID ${id}:`, error);
    throw error;
  }
}

/**
 * Delete a pet
 * Requires authentication and ownership or admin role
 */
export async function deletePetApi(
  id: string,
): Promise<{ success: boolean; message: string }> {
  try {
    const token = await getAuthToken();
    if (!token) {
      throw { error: "Authentication required", status: 401 };
    }

    const response = await fetch(`${API_URL}/api/pets/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw await handleApiError(response);
    }

    const data = await response.json();
    return data as { success: boolean; message: string };
  } catch (error) {
    console.error(`Error deleting pet with ID ${id}:`, error);
    throw error;
  }
}

/**
 * Block a pet (admin/moderator only)
 */
export async function blockPetApi(id: string): Promise<PetResponse> {
  try {
    const token = await getAuthToken();
    if (!token) {
      throw { error: "Authentication required", status: 401 };
    }

    const response = await fetch(`${API_URL}/api/pets/${id}/block`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw await handleApiError(response);
    }

    const data = await response.json();
    return data as PetResponse;
  } catch (error) {
    console.error(`Error blocking pet with ID ${id}:`, error);
    throw error;
  }
}

/**
 * Unblock a pet (admin/moderator only)
 */
export async function unblockPetApi(
  id: string,
  originalStatus: "lost" | "found" = "lost",
): Promise<PetResponse> {
  try {
    const token = await getAuthToken();
    if (!token) {
      throw { error: "Authentication required", status: 401 };
    }

    const response = await fetch(`${API_URL}/api/pets/${id}/unblock`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ originalStatus }),
    });

    if (!response.ok) {
      throw await handleApiError(response);
    }

    const data = await response.json();
    return data as PetResponse;
  } catch (error) {
    console.error(`Error unblocking pet with ID ${id}:`, error);
    throw error;
  }
}
