import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { User } from '@/types/models';
import { authAPI, removeToken } from '@/services/api.service';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ user?: User; error?: string }>;
  signup: (name: string, email: string, password: string) => Promise<{ user?: User; error?: string }>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const response = await authAPI.getCurrentUser();
      if (response.success && response.user) {
        setUser(response.user);
      }
    } catch (error) {
      console.log('No user session found');
      // Clear token if invalid
      await removeToken();
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string): Promise<{ user?: User; error?: string }> => {
    try {
      // Validate
      if (!name.trim() || !email.trim() || !password) {
        return { error: 'All fields are required' };
      }

      if (!/\S+@\S+\.\S+/.test(email)) {
        return { error: 'Invalid email format' };
      }

      if (password.length < 6) {
        return { error: 'Password must be at least 6 characters' };
      }

      const response = await authAPI.signup(name, email, password);
      
      if (response.success && response.user) {
        setUser(response.user);
        return { user: response.user };
      }

      return { error: response.error || 'Signup failed' };
    } catch (error: any) {
      return { error: error.message || 'An error occurred during signup' };
    }
  };

  const login = async (email: string, password: string): Promise<{ user?: User; error?: string }> => {
    try {
      // Clear any existing data first
      await clearAllData();
      
      const response = await authAPI.login(email, password);
      
      if (response.success && response.user) {
        setUser(response.user);
        return { user: response.user };
      }

      return { error: response.error || 'Login failed' };
    } catch (error: any) {
      return { error: error.message || 'An error occurred during login' };
    }
  };

  const clearAllData = async () => {
    try {
      // Clear all AsyncStorage data except theme
      const theme = await AsyncStorage.getItem('theme');
      await AsyncStorage.clear();
      if (theme) {
        await AsyncStorage.setItem('theme', theme);
      }
    } catch (error) {
      console.error('Error clearing data:', error);
    }
  };

  const logout = async () => {
    try {
      // Clear token
      await authAPI.logout();
      
      // Clear all cached data
      await clearAllData();
      
      // Clear user state
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const resetPassword = async (email: string): Promise<{ success: boolean; error?: string }> => {
    try {
      // This is a placeholder - implement actual password reset logic
      if (!email || !/\S+@\S+\.\S+/.test(email)) {
        return { success: false, error: 'Invalid email address' };
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message || 'Failed to send reset email' };
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
};
