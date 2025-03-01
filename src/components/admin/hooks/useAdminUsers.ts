import { useState, useEffect } from "react";
import { useUserDatabase } from "@/components/auth/useUserDatabase";

/**
 * Custom hook for managing users in the admin interface
 * Separates user management logic from the AdminContext
 */
export function useAdminUsers() {
  const {
    users,
    loading: loadingUsers,
    error: userError,
    loadAllUsers,
    editUser,
    removeUser,
  } = useUserDatabase();

  // Admin-specific functions for user management
  const blockUser = async (id: string) => {
    return await editUser(id, { status: "blocked" });
  };

  const unblockUser = async (id: string) => {
    return await editUser(id, { status: "active" });
  };

  // Load users on initial mount
  useEffect(() => {
    loadAllUsers();
  }, []);

  return {
    users,
    loadingUsers,
    userError,
    loadUsers: loadAllUsers,
    updateUser: editUser,
    deleteUser: removeUser,
    blockUser,
    unblockUser,
  };
}
