import { User, UserRegistration } from '@/models/User';
import { apiRequest } from './api';

export class AuthService {
  static async login(email: string, password: string): Promise<User> {
    try {
      const response = await apiRequest('POST', '/auth/login', { email, password });
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw new Error('Falha no login. Verifique suas credenciais.');
    }
  }

  static async register(userData: UserRegistration): Promise<User> {
    try {
      const response = await apiRequest('POST', '/auth/register', userData);
      return response.data;
    } catch (error) {
      console.error('Register error:', error);
      throw new Error('Falha no cadastro. Tente novamente.');
    }
  }

  static async logout(): Promise<void> {
    try {
      await apiRequest('DELETE', '/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
      // Mesmo com erro, remove do localStorage
      localStorage.removeItem('user');
    }
  }

  static async getCurrentUser(): Promise<User | null> {
    try {
      const response = await apiRequest('GET', '/auth/me');
      return response.data;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }
}
