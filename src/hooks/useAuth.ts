import { useState, useEffect } from "react";
import { getCurrentUser, AuthUser } from "@/api";

/**
 * Hook for managing authentication state in the UI
 */
export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user is authenticated
  const checkAuth = async () => {
    try {
      setLoading(true);
      setError(null);

      const currentUser = await getCurrentUser();
      setUser(currentUser);

      return currentUser;
    } catch (err: any) {
      console.error("Error checking authentication:", err);
      setError(err.message || "Authentication error");
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Check if user has a specific role
  const hasRole = (role: "user" | "moderator" | "admin"): boolean => {
    if (!user) return false;

    if (user.role === "admin") return true;
    if (user.role === "moderator" && (role === "moderator" || role === "user"))
      return true;
    if (user.role === "user" && role === "user") return true;

    return false;
  };

  // Check authentication on mount
  useEffect(() => {
    checkAuth();
  }, []);

  return {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    checkAuth,
    hasRole,
  };
}
