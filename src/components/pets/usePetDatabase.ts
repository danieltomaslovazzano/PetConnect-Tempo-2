import { useState, useEffect } from "react";
import {
  supabase,
  getPets,
  getLostPets,
  getFoundPets,
  createPet,
  updatePet,
  deletePet,
} from "@/lib/supabase";
import { mockLostPets, mockFoundPets } from "./MockPetsData";

// Shared hook for pet data management across consumer and admin interfaces
export function usePetDatabase() {
  const [pets, setPets] = useState<any[]>([]);
  const [lostPets, setLostPets] = useState<any[]>([]);
  const [foundPets, setFoundPets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load all pets
  const loadAllPets = async () => {
    try {
      setLoading(true);
      const data = await getPets();
      setPets(data);
      return data;
    } catch (err: any) {
      console.error("Error loading all pets:", err);
      setError(err.message || "Failed to load pets");
      console.log("Using mock data due to error");
      const allMockPets = [...mockLostPets, ...mockFoundPets];
      setPets(allMockPets);
      return allMockPets;
    } finally {
      setLoading(false);
    }
  };

  // Load lost pets
  const loadLostPets = async () => {
    try {
      setLoading(true);
      const data = await getLostPets();
      setLostPets(data);
      return data;
    } catch (err: any) {
      console.error("Error loading lost pets:", err);
      setError(err.message || "Failed to load lost pets");
      console.log("Using mock data due to error");
      setLostPets(mockLostPets);
      return mockLostPets;
    } finally {
      setLoading(false);
    }
  };

  // Load found pets
  const loadFoundPets = async () => {
    try {
      setLoading(true);
      const data = await getFoundPets();
      setFoundPets(data);
      return data;
    } catch (err: any) {
      console.error("Error loading found pets:", err);
      setError(err.message || "Failed to load found pets");
      console.log("Using mock data due to error");
      setFoundPets(mockFoundPets);
      return mockFoundPets;
    } finally {
      setLoading(false);
    }
  };

  // Add a new pet
  const addPet = async (petData: any) => {
    try {
      const newPet = await createPet(petData);
      setPets((prev) => [newPet, ...prev]);

      // Update the appropriate category list
      if (petData.status === "lost") {
        setLostPets((prev) => [newPet, ...prev]);
      } else if (petData.status === "found") {
        setFoundPets((prev) => [newPet, ...prev]);
      }

      return newPet;
    } catch (err: any) {
      setError(err.message || "Failed to add pet");
      throw err;
    }
  };

  // Update a pet
  const editPet = async (id: string, petData: any) => {
    try {
      const updatedPet = await updatePet(id, petData);

      // Update in all relevant lists
      setPets((prev) =>
        prev.map((pet) => (pet.id === id ? updatedPet[0] : pet)),
      );
      setLostPets((prev) =>
        prev.map((pet) => (pet.id === id ? updatedPet[0] : pet)),
      );
      setFoundPets((prev) =>
        prev.map((pet) => (pet.id === id ? updatedPet[0] : pet)),
      );

      return updatedPet;
    } catch (err: any) {
      setError(err.message || "Failed to update pet");
      throw err;
    }
  };

  // Remove a pet
  const removePet = async (id: string) => {
    try {
      await deletePet(id);

      // Remove from all lists
      setPets((prev) => prev.filter((pet) => pet.id !== id));
      setLostPets((prev) => prev.filter((pet) => pet.id !== id));
      setFoundPets((prev) => prev.filter((pet) => pet.id !== id));

      return true;
    } catch (err: any) {
      setError(err.message || "Failed to delete pet");
      throw err;
    }
  };

  // Set up real-time subscription for pets table
  useEffect(() => {
    // Initial data load without subscription
    loadAllPets();
    loadLostPets();
    loadFoundPets();

    // Skip real-time subscription for now due to connection issues
    console.log("Skipping real-time subscription due to connection issues");
    // Empty cleanup function
    return () => {};
  }, []);

  return {
    pets,
    lostPets,
    foundPets,
    loading,
    error,
    loadAllPets,
    loadLostPets,
    loadFoundPets,
    addPet,
    editPet,
    removePet,
  };
}
