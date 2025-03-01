import { supabase } from "@/lib/supabase";
import { AuthResponse, AuthError, AuthUser } from "./types";

/**
 * Get the current authenticated user
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;

    if (!data?.user) return null;

    // Get additional user data from the users table
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("name, role")
      .eq("id", data.user.id)
      .single();

    if (userError) throw userError;

    return {
      id: data.user.id,
      email: data.user.email || "",
      name: userData?.name || "",
      role: (userData?.role as "user" | "moderator" | "admin") || "user",
    };
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
}

/**
 * Get the JWT token for the current session
 */
export async function getAuthToken(): Promise<string | null> {
  try {
    const { data } = await supabase.auth.getSession();
    return data.session?.access_token || null;
  } catch (error) {
    console.error("Error getting auth token:", error);
    return null;
  }
}

/**
 * Check if the current user has the required role
 */
export async function hasRole(
  requiredRole: "user" | "moderator" | "admin",
): Promise<boolean> {
  const user = await getCurrentUser();
  if (!user) return false;

  // Admin can do everything
  if (user.role === "admin") return true;

  // Moderator can do moderator and user things
  if (
    user.role === "moderator" &&
    (requiredRole === "moderator" || requiredRole === "user")
  )
    return true;

  // User can only do user things
  if (user.role === "user" && requiredRole === "user") return true;

  return false;
}

/**
 * Check if the current user is the owner of a resource
 */
export async function isResourceOwner(
  resourceTable: string,
  resourceId: string,
): Promise<boolean> {
  const user = await getCurrentUser();
  if (!user) return false;

  try {
    // For pets table
    if (resourceTable === "pets") {
      const { data, error } = await supabase
        .from("pets")
        .select("owner_id")
        .eq("id", resourceId)
        .single();

      if (error) throw error;
      return data.owner_id === user.id;
    }

    // Add other resource tables as needed

    return false;
  } catch (error) {
    console.error(
      `Error checking ownership of ${resourceTable}/${resourceId}:`,
      error,
    );
    return false;
  }
}
