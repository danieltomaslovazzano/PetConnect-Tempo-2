import { createContext, useContext, ReactNode, useState, useEffect } from "react";

// Create a context for admin functionality
export interface AdminContextType {
  // User management
  users: { id: string; name: string; email: string; }[];
  loadingUsers: boolean;
  userError: string | null;
  loadUsers: () => Promise<any[]>;
  updateUser: (id: string, userData: any) => Promise<any>;
  deleteUser: (id: string) => Promise<boolean>;
  blockUser: (id: string) => Promise<any>;
  unblockUser: (id: string) => Promise<any>;

  // Pet management
  pets: { id: string; name: string; type: string; }[];
  loadingPets: boolean;
  petError: string | null;
  loadPets: () => Promise<any[]>;
  createPet: (petData: any) => Promise<any>;
  updatePet: (id: string, petData: any) => Promise<any>;
  deletePet: (id: string) => Promise<boolean>;
  blockPet: (id: string) => Promise<any>;
  unblockPet: (id: string) => Promise<any>;
}

// Create the context with a default undefined value
const defaultAdminContext: AdminContextType = {
  users: [],
  loadingUsers: false,
  userError: null,
  loadUsers: async () => [],
  updateUser: async () => ({}),
  deleteUser: async () => true,
  blockUser: async () => ({}),
  unblockUser: async () => ({}),

  pets: [],
  loadingPets: false,
  petError: null,
  loadPets: async () => [],
  createPet: async () => ({}),
  updatePet: async () => ({}),
  deletePet: async () => true,
  blockPet: async () => ({}),
  unblockPet: async () => ({}),
};

export const AdminContext = createContext<AdminContextType>(defaultAdminContext);

// Define the useAdmin hook
export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
}
