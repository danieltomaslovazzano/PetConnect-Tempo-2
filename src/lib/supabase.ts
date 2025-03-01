import { createClient } from "@supabase/supabase-js";
import { Database } from "@/types/supabase";

// Initialize Supabase client with project details
const supabaseUrl = "https://phpuqsfq.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBocHVxc2ZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA4MjQwODcsImV4cCI6MjA1NjQwMDA4N30.KWpJHwJbMPIGYbwzQYpbhkLvh5xQpJZyxD-Jj0Tqs6I";

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

import { Role, Action, Resource, createAuditLog } from "./rbac";
import { getCurrentUser } from "./auth";

// Shared database functions for both admin and consumer sides

// Users
export const getUsers = async () => {
  // Get current user for audit logging
  const currentUser = await getCurrentUser();
  const userId = currentUser?.id || "system";

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;

  // Log the read action
  createAuditLog(userId, Action.READ, Resource.USERS, "all", null, null);

  return data;
};

export const getUserById = async (id: string) => {
  // Get current user for audit logging
  const currentUser = await getCurrentUser();
  const userId = currentUser?.id || "system";

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;

  // Log the read action
  createAuditLog(userId, Action.READ, Resource.USERS, id, null, null);

  return data;
};

export const updateUser = async (id: string, userData: any) => {
  // Get current user for audit logging
  const currentUser = await getCurrentUser();
  const userId = currentUser?.id || "system";

  // Get the old data for audit logging
  const { data: oldData } = await supabase
    .from("users")
    .select("*")
    .eq("id", id)
    .single();

  const { data, error } = await supabase
    .from("users")
    .update(userData)
    .eq("id", id)
    .select();

  if (error) throw error;

  // Log the update action
  createAuditLog(userId, Action.UPDATE, Resource.USERS, id, oldData, userData);

  return data;
};

export const deleteUser = async (id: string) => {
  // Get current user for audit logging
  const currentUser = await getCurrentUser();
  const userId = currentUser?.id || "system";

  // Get the old data for audit logging
  const { data: oldData } = await supabase
    .from("users")
    .select("*")
    .eq("id", id)
    .single();

  const { error } = await supabase.from("users").delete().eq("id", id);

  if (error) throw error;

  // Log the delete action
  createAuditLog(userId, Action.DELETE, Resource.USERS, id, oldData, null);

  return true;
};

// Pets
export const getPets = async () => {
  // Get current user for audit logging
  const currentUser = await getCurrentUser();
  const userId = currentUser?.id || "system";

  const { data, error } = await supabase
    .from("pets")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;

  // Log the read action
  createAuditLog(userId, Action.READ, Resource.PETS, "all", null, null);

  return data;
};

export const getPetById = async (id: string) => {
  // Get current user for audit logging
  const currentUser = await getCurrentUser();
  const userId = currentUser?.id || "system";

  const { data, error } = await supabase
    .from("pets")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;

  // Log the read action
  createAuditLog(userId, Action.READ, Resource.PETS, id, null, null);

  return data;
};

export const createPet = async (petData: any) => {
  // Get current user for audit logging
  const currentUser = await getCurrentUser();
  const userId = currentUser?.id || "system";

  const { data, error } = await supabase
    .from("pets")
    .insert([petData])
    .select();

  if (error) throw error;

  // Log the create action
  createAuditLog(
    userId,
    Action.CREATE,
    Resource.PETS,
    data[0].id,
    null,
    petData,
  );

  return data[0];
};

export const updatePet = async (id: string, petData: any) => {
  // Get current user for audit logging
  const currentUser = await getCurrentUser();
  const userId = currentUser?.id || "system";

  // Get the old data for audit logging
  const { data: oldData } = await supabase
    .from("pets")
    .select("*")
    .eq("id", id)
    .single();

  const { data, error } = await supabase
    .from("pets")
    .update(petData)
    .eq("id", id)
    .select();

  if (error) throw error;

  // Log the update action
  createAuditLog(userId, Action.UPDATE, Resource.PETS, id, oldData, petData);

  return data;
};

export const deletePet = async (id: string) => {
  // Get current user for audit logging
  const currentUser = await getCurrentUser();
  const userId = currentUser?.id || "system";

  // Get the old data for audit logging
  const { data: oldData } = await supabase
    .from("pets")
    .select("*")
    .eq("id", id)
    .single();

  const { error } = await supabase.from("pets").delete().eq("id", id);

  if (error) throw error;

  // Log the delete action
  createAuditLog(userId, Action.DELETE, Resource.PETS, id, oldData, null);

  return true;
};

// Block/unblock functions
export const blockUser = async (id: string) => {
  // Get current user for audit logging
  const currentUser = await getCurrentUser();
  const userId = currentUser?.id || "system";

  const { data, error } = await supabase
    .from("users")
    .update({ status: "blocked" })
    .eq("id", id)
    .select();

  if (error) throw error;

  // Log the block action
  createAuditLog(userId, Action.BLOCK, Resource.USERS, id, null, {
    status: "blocked",
  });

  return data;
};

export const unblockUser = async (id: string) => {
  // Get current user for audit logging
  const currentUser = await getCurrentUser();
  const userId = currentUser?.id || "system";

  const { data, error } = await supabase
    .from("users")
    .update({ status: "active" })
    .eq("id", id)
    .select();

  if (error) throw error;

  // Log the unblock action
  createAuditLog(userId, Action.UNBLOCK, Resource.USERS, id, null, {
    status: "active",
  });

  return data;
};

export const blockPet = async (id: string) => {
  // Get current user for audit logging
  const currentUser = await getCurrentUser();
  const userId = currentUser?.id || "system";

  const { data, error } = await supabase
    .from("pets")
    .update({ status: "blocked" })
    .eq("id", id)
    .select();

  if (error) throw error;

  // Log the block action
  createAuditLog(userId, Action.BLOCK, Resource.PETS, id, null, {
    status: "blocked",
  });

  return data;
};

export const unblockPet = async (
  id: string,
  originalStatus: "lost" | "found" = "lost",
) => {
  // Get current user for audit logging
  const currentUser = await getCurrentUser();
  const userId = currentUser?.id || "system";

  const { data, error } = await supabase
    .from("pets")
    .update({ status: originalStatus })
    .eq("id", id)
    .select();

  if (error) throw error;

  // Log the unblock action
  createAuditLog(userId, Action.UNBLOCK, Resource.PETS, id, null, {
    status: originalStatus,
  });

  return data;
};

// Get lost pets
export const getLostPets = async () => {
  // Get current user for audit logging
  const currentUser = await getCurrentUser();
  const userId = currentUser?.id || "system";

  const { data, error } = await supabase
    .from("pets")
    .select("*")
    .eq("status", "lost")
    .order("created_at", { ascending: false });

  if (error) throw error;

  // Log the read action
  createAuditLog(userId, Action.READ, Resource.PETS, "lost", null, null);

  return data;
};

// Get found pets
export const getFoundPets = async () => {
  // Get current user for audit logging
  const currentUser = await getCurrentUser();
  const userId = currentUser?.id || "system";

  const { data, error } = await supabase
    .from("pets")
    .select("*")
    .eq("status", "found")
    .order("created_at", { ascending: false });

  if (error) throw error;

  // Log the read action
  createAuditLog(userId, Action.READ, Resource.PETS, "found", null, null);

  return data;
};

// Matches
export const getMatches = async () => {
  // Get current user for audit logging
  const currentUser = await getCurrentUser();
  const userId = currentUser?.id || "system";

  const { data, error } = await supabase
    .from("matches")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;

  // Log the read action
  createAuditLog(userId, Action.READ, Resource.MATCHES, "all", null, null);

  return data;
};

export const getMatchById = async (id: string) => {
  // Get current user for audit logging
  const currentUser = await getCurrentUser();
  const userId = currentUser?.id || "system";

  const { data, error } = await supabase
    .from("matches")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;

  // Log the read action
  createAuditLog(userId, Action.READ, Resource.MATCHES, id, null, null);

  return data;
};

export const createMatch = async (matchData: any) => {
  // Get current user for audit logging
  const currentUser = await getCurrentUser();
  const userId = currentUser?.id || "system";

  const { data, error } = await supabase
    .from("matches")
    .insert([matchData])
    .select();

  if (error) throw error;

  // Log the create action
  createAuditLog(
    userId,
    Action.CREATE,
    Resource.MATCHES,
    data[0].id,
    null,
    matchData,
  );

  return data[0];
};

export const updateMatch = async (id: string, matchData: any) => {
  // Get current user for audit logging
  const currentUser = await getCurrentUser();
  const userId = currentUser?.id || "system";

  // Get the old data for audit logging
  const { data: oldData } = await supabase
    .from("matches")
    .select("*")
    .eq("id", id)
    .single();

  const { data, error } = await supabase
    .from("matches")
    .update(matchData)
    .eq("id", id)
    .select();

  if (error) throw error;

  // Log the update action
  createAuditLog(
    userId,
    Action.UPDATE,
    Resource.MATCHES,
    id,
    oldData,
    matchData,
  );

  return data;
};

export const deleteMatch = async (id: string) => {
  // Get current user for audit logging
  const currentUser = await getCurrentUser();
  const userId = currentUser?.id || "system";

  // Get the old data for audit logging
  const { data: oldData } = await supabase
    .from("matches")
    .select("*")
    .eq("id", id)
    .single();

  const { error } = await supabase.from("matches").delete().eq("id", id);

  if (error) throw error;

  // Log the delete action
  createAuditLog(userId, Action.DELETE, Resource.MATCHES, id, oldData, null);

  return true;
};

// Audit logs
export const getAuditLogs = async () => {
  const { data, error } = await supabase
    .from("audit_logs")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
};

export const getAuditLogsByUser = async (userId: string) => {
  const { data, error } = await supabase
    .from("audit_logs")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
};

export const getAuditLogsByResource = async (
  resource: Resource,
  resourceId: string,
) => {
  const { data, error } = await supabase
    .from("audit_logs")
    .select("*")
    .eq("table_name", resource)
    .eq("record_id", resourceId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
};
