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
 export interface UserRegister{
  name: string;
  email: string;
  phone?:string;
  password:string;
 }