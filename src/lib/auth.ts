import { supabase } from "./supabase";
import {
  Role,
  Action,
  Resource,
  checkPermission,
  createAuditLog,
} from "./rbac";

// Funciones de autenticación de usuario
export async function signUp(email: string, password: string, name: string) {
  try {
    // Registrar usuario con Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) throw authError;

    if (authData.user) {
      // Crear perfil de usuario en la tabla "profiles"
      const { data, error } = await supabase.from("profiles").insert([
        {
          id: authData.user.id,
          email,
          name,
          role: Role.USER, // Rol por defecto para nuevos usuarios
          status: "active",
          created_at: new Date().toISOString(),
        },
      ]);

      if (error) throw error;

      // Crear registro de auditoría para la creación del usuario
      createAuditLog(
        authData.user.id,
        Action.CREATE,
        Resource.USERS, // Si se requiere, puedes actualizar este recurso a otro valor
        authData.user.id,
        null,
        { email, name, role: Role.USER },
      );

      return { user: authData.user, profile: data };
    }
  } catch (error) {
    console.error("Error en el signUp:", error);
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

    // Actualizar la fecha del último inicio de sesión
    if (data.user) {
      await supabase
        .from("profiles")
        .update({ last_login: new Date().toISOString() })
        .eq("id", data.user.id);
    }

    return data;
  } catch (error) {
    console.error("Error en el signIn:", error);
    throw error;
  }
}

export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  } catch (error) {
    console.error("Error en el signOut:", error);
    throw error;
  }
}

export async function getCurrentUser() {
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;
    return data?.user || null;
  } catch (error) {
    console.error("Error obteniendo el usuario actual:", error);
    return null;
  }
}

export async function getUserRole(userId: string): Promise<Role> {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .single();

    if (error) throw error;
    return (data?.role as Role) || Role.USER;
  } catch (error) {
    console.error("Error obteniendo el rol del usuario:", error);
    return Role.USER; // Rol por defecto si ocurre algún error
  }
}

// Verifica si el usuario actual puede realizar una acción sobre un recurso
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
    console.error("Error verificando permisos:", error);
    return false;
  }
}