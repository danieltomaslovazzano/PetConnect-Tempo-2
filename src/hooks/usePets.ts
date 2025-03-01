import { useState, useEffect } from "react";
import {
  fetchPets,
  fetchPetById,
  createPetApi,
  updatePetApi,
  deletePetApi,
  Pet,
  CreatePetRequest,
  UpdatePetRequest,
  PetFilters,
} from "@/api";

/**
 * Hook for managing pets in the UI
 */
export function usePets(initialFilters: PetFilters = {}) {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<PetFilters>(initialFilters);
  const [totalCount, setTotalCount] = useState(0);

  // Load pets with current filters
  const loadPets = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetchPets(filters);
      setPets(response.pets);
      setTotalCount(response.count);

      return response.pets;
    } catch (err: any) {
      console.error("Error loading pets:", err);
      setError(err.error || "Failed to load pets");
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Get a single pet by ID
  const getPet = async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetchPetById(id);
      return response.pet;
    } catch (err: any) {
      console.error(`Error loading pet with ID ${id}:`, err);
      setError(err.error || "Failed to load pet");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Create a new pet
  const createPet = async (petData: CreatePetRequest) => {
    try {
      setLoading(true);
      setError(null);

      const response = await createPetApi(petData);

      // Update the pets list with the new pet
      setPets((prevPets) => [response.pet, ...prevPets]);
      setTotalCount((prev) => prev + 1);

      return response.pet;
    } catch (err: any) {
      console.error("Error creating pet:", err);
      setError(err.error || "Failed to create pet");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update an existing pet
  const updatePet = async (id: string, petData: UpdatePetRequest) => {
    try {
      setLoading(true);
      setError(null);

      const response = await updatePetApi(id, petData);

      // Update the pets list with the updated pet
      setPets((prevPets) =>
        prevPets.map((pet) => (pet.id === id ? response.pet : pet)),
      );

      return response.pet;
    } catch (err: any) {
      console.error(`Error updating pet with ID ${id}:`, err);
      setError(err.error || "Failed to update pet");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete a pet
  const deletePet = async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      await deletePetApi(id);

      // Remove the pet from the pets list
      setPets((prevPets) => prevPets.filter((pet) => pet.id !== id));
      setTotalCount((prev) => prev - 1);

      return true;
    } catch (err: any) {
      console.error(`Error deleting pet with ID ${id}:`, err);
      setError(err.error || "Failed to delete pet");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update filters and reload pets
  const updateFilters = (newFilters: PetFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  // Load pets when filters change
  useEffect(() => {
    loadPets();
  }, [filters]);

  return {
    pets,
    loading,
    error,
    totalCount,
    filters,
    loadPets,
    getPet,
    createPet,
    updatePet,
    deletePet,
    updateFilters,
  };
}
