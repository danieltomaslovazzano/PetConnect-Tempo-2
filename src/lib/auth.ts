import { supabase } from "./supabase";
import {
  Role,
  Action,
  Resource,
  checkPermission,
  createAuditLog,
} from "./rbac";

// User authentication functions
export async function signUp(email: string, password: string, name: string) {
  try {
    // Register user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) throw authError;

    if (authData.user) {
      // Create user profile in the users table
      const { data, error } = await supabase.from("users").insert([
        {
          id: authData.user.id,
          email,
          name,
          role: Role.USER, // Default role for new users
          status: "active",
          created_at: new Date().toISOString(),
        },
      ]);

      if (error) throw error;

      // Create audit log for user creation
      createAuditLog(
        authData.user.id,
        Action.CREATE,
        Resource.USERS,
        authData.user.id,
        null,
        { email, name, role: Role.USER },
      );

      return { user: authData.user, profile: data };
    }
  } catch (error) {
    console.error("Error signing up:", error);
    throw error;
  }
}

export async function signIn(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    // Update last login timestamp
    if (data.user) {
      await supabase
        .from("users")
        .update({ last_login: new Date().toISOString() })
        .eq("id", data.user.id);
    }

    return data;
  } catch (error) {
    console.error("Error signing in:", error);
    throw error;
  }
}

export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
}

export async function getCurrentUser() {
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;
    return data?.user || null;
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
}

export async function getUserRole(userId: string): Promise<Role> {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("role")
      .eq("id", userId)
      .single();

    if (error) throw error;
    return (data?.role as Role) || Role.USER;
  } catch (error) {
    console.error("Error getting user role:", error);
    return Role.USER; // Default to user role if there's an error
  }
}

// Check if the current user can perform an action on a resource
export async function currentUserCan(
  action: Action,
  resource: Resource,
  resourceOwnerId?: string,
): Promise<boolean> {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) return false;

    const userRole = await getUserRole(currentUser.id);
    const isOwner = resourceOwnerId
      ? currentUser.id === resourceOwnerId
      : false;

    return checkPermission(userRole, action, resource, isOwner);
  } catch (error) {
    console.error("Error checking permissions:", error);
    return false;
  }
}
