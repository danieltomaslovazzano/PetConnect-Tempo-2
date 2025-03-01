import React, { ReactNode } from "react";
import { AdminContext, AdminContextType } from "./AdminContext";
import { useAdminUsers } from "../hooks/useAdminUsers";
import { useAdminPets } from "../hooks/useAdminPets";

interface AdminProviderProps {
  children: ReactNode;
}

export function AdminProvider({ children }: AdminProviderProps) {
  // Use the custom hooks for admin functionality
  const {
    users,
    loadingUsers,
    userError,
    loadUsers: loadAllUsers,
    updateUser: editUser,
    deleteUser: removeUser,
    blockUser,
    unblockUser,
  } = useAdminUsers();

  const {
    pets,
    loadingPets,
    petError,
    loadPets: loadAllPets,
    createPet: addPet,
    updatePet: editPet,
    deletePet: removePet,
    blockPet,
    unblockPet,
  } = useAdminPets();

  const value: AdminContextType = {
    // User management
    users,
    loadingUsers,
    userError,
    loadUsers: loadAllUsers,
    updateUser: editUser,
    deleteUser: removeUser,
    blockUser,
    unblockUser,

    // Pet management
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

  return (
    <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
  );
}
