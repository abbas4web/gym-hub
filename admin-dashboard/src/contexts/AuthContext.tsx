import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { superAdminAPI } from '../services/api';

interface SuperAdmin {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  superAdmin: SuperAdmin | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isLoading: boolean;
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
  const [superAdmin, setSuperAdmin] = useState<SuperAdmin | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('superAdminToken');
    if (token) {
      try {
        const response = await superAdminAPI.getMe();
        if (response.success) {
          setSuperAdmin(response.superAdmin);
        }
      } catch (error) {
        localStorage.removeItem('superAdminToken');
      }
    }
    setIsLoading(false);
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await superAdminAPI.login(email, password);
      if (response.success && response.token) {
        localStorage.setItem('superAdminToken', response.token);
        setSuperAdmin(response.superAdmin);
        return { success: true };
      }
      return { success: false, error: response.error || 'Login failed' };
    } catch (error: any) {
      return { success: false, error: error.response?.data?.error || 'Login failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('superAdminToken');
    setSuperAdmin(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ superAdmin, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
