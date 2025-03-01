/**
 * Common types used across the admin module
 */

// User types
export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "active" | "blocked" | "pending";
  joinDate: string;
  avatarUrl?: string;
  lastLogin?: string;
}

// Pet types
export interface AdminPet {
  id: string;
  name: string;
  type: string;
  breed: string;
  owner: string;
  ownerEmail: string;
  status: "lost" | "found" | "blocked" | "resolved";
  reportedDate: string;
  location: string;
  imageUrl: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  description?: string;
}

// Audit log types
export interface AuditLog {
  id: string;
  userId: string;
  action: "create" | "read" | "update" | "delete" | "block" | "unblock";
  tableName: string;
  recordId: string;
  timestamp: string;
  oldValues?: any;
  newValues?: any;
}
