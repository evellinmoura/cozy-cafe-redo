
export interface User {
  name: string;
  email: string;
  phone?: string;
  isNewUser?: boolean;
}

export interface UserRegistration {
  name: string;
  email: string;
  phone?: string;
  password: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}
