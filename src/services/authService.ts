
import { User } from '@/models/User';

export class AuthService {
  private static readonly USER_STORAGE_KEY = 'user';

  static login(email: string, password: string): User {
    // Simular login
    const user: User = { email, name: "Usuário" };
    this.saveUser(user);
    return user;
  }

  static register(userData: Omit<User, 'isNewUser'>): User {
    const user: User = { ...userData, isNewUser: true };
    this.saveUser(user);
    return user;
  }

  static logout(): void {
    localStorage.removeItem(this.USER_STORAGE_KEY);
  }

  static getCurrentUser(): User | null {
    try {
      const userData = localStorage.getItem(this.USER_STORAGE_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  }

  private static saveUser(user: User): void {
    localStorage.setItem(this.USER_STORAGE_KEY, JSON.stringify(user));
  }
}
