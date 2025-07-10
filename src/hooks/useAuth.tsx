
import { useState, useEffect } from 'react';
import { AuthService } from '@/services/authService';
import { User, AuthState } from '@/models/User';

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false
  });

  useEffect(() => {
    const user = AuthService.getCurrentUser();
    setAuthState({
      user,
      isAuthenticated: !!user
    });
  }, []);

  const login = (email: string, password: string) => {
    const user = AuthService.login(email, password);
    setAuthState({
      user,
      isAuthenticated: true
    });
    return user;
  };

  const register = (userData: Omit<User, 'isNewUser'>) => {
    const user = AuthService.register(userData);
    setAuthState({
      user,
      isAuthenticated: true
    });
    return user;
  };

  const logout = () => {
    AuthService.logout();
    setAuthState({
      user: null,
      isAuthenticated: false
    });
  };

  return {
    ...authState,
    login,
    register,
    logout
  };
};
