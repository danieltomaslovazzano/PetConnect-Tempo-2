import { supabase } from "@/lib/supabase";
import { AuthResponse, AuthError, AuthUser } from "./types";

import { cacheService } from "../cache/cacheService";

/**
 * Get the current authenticated user
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    // Try to get from cache first for better performance
    const cacheKey = "current_user";
    const cachedUser = cacheService.get<AuthUser>(cacheKey);
    if (cachedUser) return cachedUser;

    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;

    if (!data?.user) return null;

    // Get additional user data from the profiles table
    const { data: userData, error: userError } = await supabase
      .from("profiles")
      .select("name, role")
      .eq("id", data.user.id)
      .single();

    let user: AuthUser;
    if (userError || !userData) {
      console.error("Error fetching profile data:", userError?.message);
      user = {
        id: data.user.id,
        email: data.user.email || "",
        name: "",
        role: "user",
      };
    } else {
      user = {
        id: data.user.id,
        email: data.user.email || "",
        name: userData.name || "",
        role: (userData.role as "user" | "moderator" | "admin") || "user",
      };
    }

    // Cache the user for 5 minutes
    cacheService.set(cacheKey, user, 5 * 60 * 1000);

    return user;
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
    // Try to get from cache first
    const cacheKey = "auth_token";
    const cachedToken = cacheService.get<string>(cacheKey);
    if (cachedToken) return cachedToken;

    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token || null;

    if (token) {
      // Cache the token for 10 minutes (shorter than token expiry)
      cacheService.set(cacheKey, token, 10 * 60 * 1000);
    }

    return token;
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