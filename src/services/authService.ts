import { User, UserRegister } from '@/models/User';
import { apiRequest } from './api';

export class AuthService {
  static async login(email: string, senha: string): Promise<User> {
    try {
      const response = await apiRequest('POST', '/cliente/login', { email, senha });
      const { token, ...user } = response;
      console.log('Login response: ', response);
      localStorage.setItem("token", token);
      return user;
    } catch (error) {
      console.error('Login error:', error); 
      throw new Error('Falha no login. Verifique suas credenciais.');
    }
  }

  static async register(userData: UserRegister): Promise<User> {
    try {
      const response = await apiRequest('POST', '/cliente/register', userData);
      return response.data;
    } catch (error) {
      console.error('Register error:', error);
      throw new Error('Falha no cadastro. Tente novamente.');
    }
  }

  static async logout(): Promise<void> {
    try {
      await apiRequest('DELETE', '/cliente/logout');
    } catch (error) {
      console.error('Logout error:', error);
      // Mesmo com erro, remove do localStorage
      localStorage.removeItem('user');
    }
  }

  static async getCurrentUser(): Promise<User | null> {
    try {
      const response = await apiRequest('GET', '/cliente/me');
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }
}