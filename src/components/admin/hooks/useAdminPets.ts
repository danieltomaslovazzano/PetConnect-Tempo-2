import { useState, useEffect } from "react";
import { usePetDatabase } from "@/components/pets/usePetDatabase";

/**
 * Custom hook for managing pets in the admin interface
 * Separates pet management logic from the AdminContext
 */
export function useAdminPets() {
  const {
    pets,
    loading: loadingPets,
    error: petError,
    loadAllPets,
    addPet,
    editPet,
    removePet,
  } = usePetDatabase();

  // Admin-specific functions for pet management
  const blockPet = async (id: string) => {
    return await editPet(id, { status: "blocked" });
  };

  const unblockPet = async (id: string) => {
    return await editPet(id, { status: "lost" }); // Restore to original status
  };

  // Load pets on initial mount
  useEffect(() => {
    loadAllPets();
  }, []);

  return {
    pets,
    loadingPets,
    petError,
    loadPets: loadAllPets,
    createPet: addPet,
    updatePet: editPet,
    deletePet: removePet,
    blockPet,
    unblockPet,
  };
}
