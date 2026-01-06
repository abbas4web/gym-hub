import { create } from 'zustand';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'staff';
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  login: (user) => set({ user, isAuthenticated: true }),
  logout: () => set({ user: null, isAuthenticated: false }),
}));

// Mock authentication functions
export const getCurrentUser = async (): Promise<User | null> => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(null); // Return null for initial state, or mock user
    }, 500);
  });
};

export const login = async (email: string, password: string): Promise<{ user?: User; error?: string }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (email && password) {
        resolve({
          user: {
            id: '1',
            name: 'John Doe',
            email: email,
            role: 'admin',
          },
        });
      } else {
        resolve({ error: 'Invalid credentials' });
      }
    }, 1000);
  });
};

export const signup = async (name: string, email: string, password: string): Promise<{ user?: User; error?: string }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (email && password && name) {
        resolve({
          user: {
            id: '2',
            name: name,
            email: email,
            role: 'admin',
          },
        });
      } else {
        resolve({ error: 'Invalid data' });
      }
    }, 1000);
  });
};

export const logout = async (): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), 500);
  });
};
