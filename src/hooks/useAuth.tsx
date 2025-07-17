import { useState, useEffect } from 'react';
import { AuthService } from '@/services/authService';

import { User, AuthState, UserRegister } from '@/models/User';
export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const user = await AuthService.getCurrentUser();
        setAuthState({
          user,
          isAuthenticated: !!user
        }); 
      } catch (error) {
        console.error('Auth initialization error:', error);
        setAuthState({
          user: null,
          isAuthenticated: false
        });
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, senha: string) => {// login
    try {
      setLoading(true);
      setError(null);
      const user = await AuthService.login(email, senha);
      setAuthState({
        user,
        isAuthenticated: true
      });
      return user;
    } catch (error: any) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: UserRegister) => {
    try {
      setLoading(true);
      setError(null);
      const user = await AuthService.register(userData);
      setAuthState({
        user,
        isAuthenticated: false
      });
      return user;
    } catch (error: any) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await AuthService.logout();
      setAuthState({
        user: null,
        isAuthenticated: false
      });
    } catch (error) {
      console.error('Logout error:', error);
      // Mesmo com erro, limpa o estado
      setAuthState({
        user: null,
        isAuthenticated: false
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    ...authState,
    loading,
    error,
    login,
    register,
    logout
  };
};