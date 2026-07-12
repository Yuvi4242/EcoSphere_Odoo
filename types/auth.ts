export type UserRole = "ADMIN" | "MANAGER" | "EMPLOYEE";

export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
  xp: number;
  level: number;
  badges: string[];
}

export interface AuthState {
  user: UserSession | null;
  loading: boolean;
}
