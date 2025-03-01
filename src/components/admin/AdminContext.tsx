import React, { createContext, useContext, useState, ReactNode } from "react";
import { useUserDatabase } from "@/components/auth/useUserDatabase";
import { usePetDatabase } from "@/components/pets/usePetDatabase";

// Create a context for admin functionality
interface AdminContextType {
  // User management
  users: any[];
  loadingUsers: boolean;
  userError: string | null;
  loadUsers: () => Promise<any[]>;
  updateUser: (id: string, userData: any) => Promise<any>;
  deleteUser: (id: string) => Promise<boolean>;
  blockUser: (id: string) => Promise<any>;
  unblockUser: (id: string) => Promise<any>;

  // Pet management
  pets: any[];
  loadingPets: boolean;
  petError: string | null;
  loadPets: () => Promise<any[]>;
  createPet: (petData: any) => Promise<any>;
  updatePet: (id: string, petData: any) => Promise<any>;
  deletePet: (id: string) => Promise<boolean>;
  blockPet: (id: string) => Promise<any>;
  unblockPet: (id: string) => Promise<any>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

// Define the AdminProvider component as a named function
export function AdminProvider({ children }: { children: ReactNode }) {
  // Empty arrays for initial state - will be populated from database
  const emptyUsers: any[] = [];
  const emptyPets: any[] = [];

  // Use the shared database hooks with error handling
  let users = [],
    loadingUsers = false,
    userError = null,
    loadAllUsers = async () => [],
    editUser = async () => {},
    removeUser = async () => false;
  try {
    const userHook = useUserDatabase();
    users = userHook.users;
    loadingUsers = userHook.loading;
    userError = userHook.error;
    loadAllUsers = userHook.loadAllUsers;
    editUser = userHook.editUser;
    removeUser = userHook.removeUser;
  } catch (err) {
    console.error("Error using user database hook:", err);
    users = emptyUsers;
  }

  let pets = [],
    loadingPets = false,
    petError = null,
    loadAllPets = async () => [],
    addPet = async () => {},
    editPet = async () => {},
    removePet = async () => false;
  try {
    const petHook = usePetDatabase();
    pets = petHook.pets;
    loadingPets = petHook.loading;
    petError = petHook.error;
    loadAllPets = petHook.loadAllPets;
    addPet = petHook.addPet;
    editPet = petHook.editPet;
    removePet = petHook.removePet;
  } catch (err) {
    console.error("Error using pet database hook:", err);
    pets = emptyPets;
  }

  // Admin-specific functions for user management
  const blockUser = async (id: string) => {
    return await editUser(id, { status: "blocked" });
  };

  const unblockUser = async (id: string) => {
    return await editUser(id, { status: "active" });
  };

  // Admin-specific functions for pet management
  const blockPet = async (id: string) => {
    return await editPet(id, { status: "blocked" });
  };

  const unblockPet = async (id: string) => {
    return await editPet(id, { status: "lost" }); // Restore to original status
  };

  const value = {
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

// Define the useAdmin hook as a named function
export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
}
