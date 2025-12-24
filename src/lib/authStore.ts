import { z } from 'zod';

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

interface StoredUser extends User {
  passwordHash: string;
}

const USERS_KEY = 'gym_users';
const CURRENT_USER_KEY = 'gym_current_user';

export const loginSchema = z.object({
  email: z.string().trim().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

export const signupSchema = z.object({
  name: z.string().trim().min(2, { message: "Name must be at least 2 characters" }).max(100),
  email: z.string().trim().email({ message: "Invalid email address" }).max(255),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const resetSchema = z.object({
  email: z.string().trim().email({ message: "Invalid email address" }),
});

// Simple hash function (not cryptographically secure - use backend for production)
const simpleHash = (str: string): string => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString(36);
};

const getStoredUsers = (): StoredUser[] => {
  const data = localStorage.getItem(USERS_KEY);
  return data ? JSON.parse(data) : [];
};

const saveUsers = (users: StoredUser[]) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const getCurrentUser = (): User | null => {
  const data = localStorage.getItem(CURRENT_USER_KEY);
  return data ? JSON.parse(data) : null;
};

export const signup = (name: string, email: string, password: string): { user?: User; error?: string } => {
  const users = getStoredUsers();
  
  if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
    return { error: "An account with this email already exists" };
  }
  
  const newUser: StoredUser = {
    id: crypto.randomUUID(),
    email: email.toLowerCase(),
    name,
    passwordHash: simpleHash(password),
    createdAt: new Date().toISOString(),
  };
  
  users.push(newUser);
  saveUsers(users);
  
  const { passwordHash, ...user } = newUser;
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  
  return { user };
};

export const login = (email: string, password: string): { user?: User; error?: string } => {
  const users = getStoredUsers();
  const storedUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  
  if (!storedUser) {
    return { error: "No account found with this email" };
  }
  
  if (storedUser.passwordHash !== simpleHash(password)) {
    return { error: "Incorrect password" };
  }
  
  const { passwordHash, ...user } = storedUser;
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  
  return { user };
};

export const logout = () => {
  localStorage.removeItem(CURRENT_USER_KEY);
};

export const resetPassword = (email: string): { success: boolean; error?: string } => {
  const users = getStoredUsers();
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  
  if (!user) {
    // Don't reveal if email exists for security
    return { success: true };
  }
  
  // In a real app, this would send an email
  // For demo, we'll just simulate success
  return { success: true };
};
