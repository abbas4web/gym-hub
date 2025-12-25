import AsyncStorage from '@react-native-async-storage/async-storage';
import { Client, Receipt, User, Subscription } from '@/types/models';

// Storage keys
const KEYS = {
  CLIENTS: 'gym_clients',
  RECEIPTS: 'gym_receipts',
  USERS: 'gym_users',
  CURRENT_USER: 'gym_current_user',
  SUBSCRIPTION: 'gym_subscription',
  THEME: 'gym_theme',
};

// ==================== CLIENT OPERATIONS ====================

export const getClients = async (): Promise<Client[]> => {
  try {
    const data = await AsyncStorage.getItem(KEYS.CLIENTS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting clients:', error);
    return [];
  }
};

export const saveClient = async (client: Client): Promise<void> => {
  try {
    const clients = await getClients();
    const existingIndex = clients.findIndex(c => c.id === client.id);
    
    if (existingIndex >= 0) {
      clients[existingIndex] = client;
    } else {
      clients.push(client);
    }
    
    await AsyncStorage.setItem(KEYS.CLIENTS, JSON.stringify(clients));
  } catch (error) {
    console.error('Error saving client:', error);
    throw error;
  }
};

export const updateClient = async (clientId: string, updates: Partial<Client>): Promise<void> => {
  try {
    const clients = await getClients();
    const index = clients.findIndex(c => c.id === clientId);
    
    if (index >= 0) {
      clients[index] = { ...clients[index], ...updates };
      await AsyncStorage.setItem(KEYS.CLIENTS, JSON.stringify(clients));
    }
  } catch (error) {
    console.error('Error updating client:', error);
    throw error;
  }
};

export const deleteClient = async (clientId: string): Promise<void> => {
  try {
    const clients = await getClients();
    const filtered = clients.filter(c => c.id !== clientId);
    await AsyncStorage.setItem(KEYS.CLIENTS, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error deleting client:', error);
    throw error;
  }
};

export const getClientById = async (clientId: string): Promise<Client | null> => {
  try {
    const clients = await getClients();
    return clients.find(c => c.id === clientId) || null;
  } catch (error) {
    console.error('Error getting client by ID:', error);
    return null;
  }
};

// ==================== RECEIPT OPERATIONS ====================

export const getReceipts = async (): Promise<Receipt[]> => {
  try {
    const data = await AsyncStorage.getItem(KEYS.RECEIPTS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting receipts:', error);
    return [];
  }
};

export const saveReceipt = async (receipt: Receipt): Promise<void> => {
  try {
    const receipts = await getReceipts();
    receipts.push(receipt);
    await AsyncStorage.setItem(KEYS.RECEIPTS, JSON.stringify(receipts));
  } catch (error) {
    console.error('Error saving receipt:', error);
    throw error;
  }
};

export const getReceiptsByClientId = async (clientId: string): Promise<Receipt[]> => {
  try {
    const receipts = await getReceipts();
    return receipts.filter(r => r.clientId === clientId);
  } catch (error) {
    console.error('Error getting receipts by client ID:', error);
    return [];
  }
};

// ==================== USER OPERATIONS ====================

export const getUsers = async (): Promise<User[]> => {
  try {
    const data = await AsyncStorage.getItem(KEYS.USERS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting users:', error);
    return [];
  }
};

export const saveUser = async (user: User): Promise<void> => {
  try {
    const users = await getUsers();
    users.push(user);
    await AsyncStorage.setItem(KEYS.USERS, JSON.stringify(users));
  } catch (error) {
    console.error('Error saving user:', error);
    throw error;
  }
};

export const getUserByEmail = async (email: string): Promise<User | null> => {
  try {
    const users = await getUsers();
    return users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
  } catch (error) {
    console.error('Error getting user by email:', error);
    return null;
  }
};

export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const data = await AsyncStorage.getItem(KEYS.CURRENT_USER);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

export const setCurrentUser = async (user: User | null): Promise<void> => {
  try {
    if (user) {
      await AsyncStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
      await AsyncStorage.removeItem(KEYS.CURRENT_USER);
    }
  } catch (error) {
    console.error('Error setting current user:', error);
    throw error;
  }
};

// ==================== SUBSCRIPTION OPERATIONS ====================

export const getSubscription = async (): Promise<Subscription> => {
  try {
    const data = await AsyncStorage.getItem(KEYS.SUBSCRIPTION);
    return data ? JSON.parse(data) : {
      plan: 'free',
      billingCycle: 'monthly',
      startDate: new Date().toISOString(),
      isActive: true,
    };
  } catch (error) {
    console.error('Error getting subscription:', error);
    return {
      plan: 'free',
      billingCycle: 'monthly',
      startDate: new Date().toISOString(),
      isActive: true,
    };
  }
};

export const saveSubscription = async (subscription: Subscription): Promise<void> => {
  try {
    await AsyncStorage.setItem(KEYS.SUBSCRIPTION, JSON.stringify(subscription));
  } catch (error) {
    console.error('Error saving subscription:', error);
    throw error;
  }
};

// ==================== THEME OPERATIONS ====================

export const getTheme = async (): Promise<'light' | 'dark'> => {
  try {
    const data = await AsyncStorage.getItem(KEYS.THEME);
    return (data as 'light' | 'dark') || 'dark';
  } catch (error) {
    console.error('Error getting theme:', error);
    return 'dark';
  }
};

export const saveTheme = async (theme: 'light' | 'dark'): Promise<void> => {
  try {
    await AsyncStorage.setItem(KEYS.THEME, theme);
  } catch (error) {
    console.error('Error saving theme:', error);
    throw error;
  }
};

// ==================== UTILITY OPERATIONS ====================

export const clearAllData = async (): Promise<void> => {
  try {
    await AsyncStorage.multiRemove([
      KEYS.CLIENTS,
      KEYS.RECEIPTS,
      KEYS.CURRENT_USER,
      KEYS.SUBSCRIPTION,
    ]);
  } catch (error) {
    console.error('Error clearing data:', error);
    throw error;
  }
};
