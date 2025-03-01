// Role-Based Access Control (RBAC) for PetConnect

// Define roles and their permissions
export enum Role {
  USER = "user",
  MODERATOR = "moderator",
  ADMIN = "admin",
}

// Define resources that can be accessed
export enum Resource {
  USERS = "users",
  PETS = "pets",
  MATCHES = "matches",
  AUDIT_LOGS = "audit_logs",
}

// Define actions that can be performed
export enum Action {
  CREATE = "create",
  READ = "read",
  UPDATE = "update",
  DELETE = "delete",
  BLOCK = "block",
  UNBLOCK = "unblock",
}

// Permission matrix defining what each role can do
const permissionMatrix: Record<Role, Record<Resource, Action[]>> = {
  [Role.USER]: {
    [Resource.USERS]: [Action.READ, Action.UPDATE], // Users can read and update their own profile
    [Resource.PETS]: [Action.CREATE, Action.READ, Action.UPDATE], // Users can create, read, and update their own pets
    [Resource.MATCHES]: [Action.READ, Action.UPDATE], // Users can read and respond to matches
    [Resource.AUDIT_LOGS]: [], // Users cannot access audit logs
  },
  [Role.MODERATOR]: {
    [Resource.USERS]: [Action.READ], // Moderators can read user profiles
    [Resource.PETS]: [Action.READ, Action.UPDATE, Action.BLOCK, Action.UNBLOCK], // Moderators can moderate pet listings
    [Resource.MATCHES]: [Action.READ, Action.UPDATE], // Moderators can read and update matches
    [Resource.AUDIT_LOGS]: [Action.READ], // Moderators can read audit logs
  },
  [Role.ADMIN]: {
    [Resource.USERS]: [
      Action.CREATE,
      Action.READ,
      Action.UPDATE,
      Action.DELETE,
      Action.BLOCK,
      Action.UNBLOCK,
    ],
    [Resource.PETS]: [
      Action.CREATE,
      Action.READ,
      Action.UPDATE,
      Action.DELETE,
      Action.BLOCK,
      Action.UNBLOCK,
    ],
    [Resource.MATCHES]: [
      Action.CREATE,
      Action.READ,
      Action.UPDATE,
      Action.DELETE,
    ],
    [Resource.AUDIT_LOGS]: [Action.CREATE, Action.READ], // Admins can create and read audit logs
  },
};

// Check if a user with a given role can perform an action on a resource
export function can(role: Role, action: Action, resource: Resource): boolean {
  if (!permissionMatrix[role]) {
    return false;
  }

  if (!permissionMatrix[role][resource]) {
    return false;
  }

  return permissionMatrix[role][resource].includes(action);
}

// Check if a user can perform an action on their own resource
export function canOnOwn(
  role: Role,
  action: Action,
  resource: Resource,
): boolean {
  // Users can always read and update their own resources
  if (
    role === Role.USER &&
    (action === Action.READ || action === Action.UPDATE)
  ) {
    return true;
  }

  // For other cases, fall back to regular permission check
  return can(role, action, resource);
}

// Middleware function to check permissions
export function checkPermission(
  userRole: Role,
  action: Action,
  resource: Resource,
  isOwner: boolean = false,
) {
  if (isOwner) {
    return canOnOwn(userRole, action, resource);
  }
  return can(userRole, action, resource);
}

// Create an audit log entry
export function createAuditLog(
  userId: string,
  action: Action,
  tableName: Resource,
  recordId: string,
  oldValues?: any,
  newValues?: any,
) {
  // Log to console for debugging only - skip database logging due to connection issues
  console.log(
    `AUDIT: User ${userId} performed ${action} on ${tableName} record ${recordId}`,
  );

  return {
    userId,
    action,
    tableName,
    recordId,
    oldValues,
    newValues,
    timestamp: new Date().toISOString(),
  };
}
