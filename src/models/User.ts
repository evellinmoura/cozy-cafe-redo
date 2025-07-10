
export interface User {
  name: string;
  email: string;
  phone?: string;
  isNewUser?: boolean;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}
