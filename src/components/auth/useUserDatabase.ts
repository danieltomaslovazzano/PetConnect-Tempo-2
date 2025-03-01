import { useState, useEffect } from "react";
import {
  supabase,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "@/lib/supabase";

// Shared hook for user data management across consumer and admin interfaces
export function useUserDatabase() {
  const [users, setUsers] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load all users
  const loadAllUsers = async () => {
    try {
      setLoading(true);
      const data = await getUsers();
      setUsers(data);
      return data;
    } catch (err: any) {
      setError(err.message || "Failed to load users");
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Get current authenticated user
  const loadCurrentUser = async () => {
    try {
      setLoading(true);
      const { data } = await supabase.auth.getUser();

      if (data?.user) {
        const userData = await getUserById(data.user.id);
        setCurrentUser(userData);
        return userData;
      }
      return null;
    } catch (err: any) {
      setError(err.message || "Failed to load current user");
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Update a user
  const editUser = async (id: string, userData: any) => {
    try {
      const updatedUser = await updateUser(id, userData);

      // Update in users list
      setUsers((prev) =>
        prev.map((user) => (user.id === id ? updatedUser[0] : user)),
      );

      // Update current user if it's the same
      if (currentUser?.id === id) {
        setCurrentUser(updatedUser[0]);
      }

      return updatedUser;
    } catch (err: any) {
      setError(err.message || "Failed to update user");
      throw err;
    }
  };

  // Remove a user
  const removeUser = async (id: string) => {
    try {
      await deleteUser(id);

      // Remove from users list
      setUsers((prev) => prev.filter((user) => user.id !== id));

      // Clear current user if it's the same
      if (currentUser?.id === id) {
        setCurrentUser(null);
      }

      return true;
    } catch (err: any) {
      setError(err.message || "Failed to delete user");
      throw err;
    }
  };

  // Set up data loading without real-time subscription
  useEffect(() => {
    // Initial data load without subscription
    loadAllUsers();
    loadCurrentUser();

    // Skip real-time subscription for now due to connection issues
    console.log("Skipping real-time subscription due to connection issues");
    // Empty cleanup function
    return () => {};
  }, []);

  return {
    users,
    currentUser,
    loading,
    error,
    loadAllUsers,
    loadCurrentUser,
    editUser,
    removeUser,
  };
}
