export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: "user" | "moderator" | "admin";
}

export interface AuthToken {
  token: string;
  expires_at: number;
  refresh_token?: string;
}

export interface AuthResponse {
  user: AuthUser;
  session: AuthToken;
  message: string;
}

export interface AuthError {
  error: string;
  status: number;
  details?: any;
}
