import AsyncStorage from '@react-native-async-storage/async-storage';

// Production backend URL
const API_URL = 'https://gym-hub-backend-prod.vercel.app/api';

// Token management
const TOKEN_KEY = 'gym_auth_token';

export const getToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(TOKEN_KEY);
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
};

export const setToken = async (token: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(TOKEN_KEY, token);
  } catch (error) {
    console.error('Error setting token:', error);
  }
};

export const removeToken = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(TOKEN_KEY);
  } catch (error) {
    console.error('Error removing token:', error);
  }
};

// API request helper
const apiRequest = async (
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  body?: any,
  requiresAuth: boolean = true
) => {
  try {
    const headers: any = {
      'Content-Type': 'application/json',
    };

    if (requiresAuth) {
      const token = await getToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    const config: RequestInit = {
      method,
      headers,
    };

    if (body && (method === 'POST' || method === 'PUT')) {
      config.body = JSON.stringify(body);
    }

    const response = await fetch(`${API_URL}${endpoint}`, config);
    
    // Check if response is JSON
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Server returned non-JSON response');
    }
    
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Request failed');
    }

    return data;
  } catch (error: any) {
    // Don't log to console - errors will be shown in UI via CustomPopup
    // console.error('API Request Error:', error);
    throw error;
  }
};

// Auth API
export const authAPI = {
  signup: async (
    name: string,
    email: string,
    password: string,
    gymName?: string,
    gymLogo?: string,
    membershipPlans?: { name: string; duration: number; fee: number }[]
  ) => {
    const payload: any = { name, email, password };
    
    if (gymName) payload.gymName = gymName;
    if (gymLogo) payload.gymLogo = gymLogo;
    if (membershipPlans && membershipPlans.length > 0) {
      payload.membershipPlans = membershipPlans;
    }
    
    const data = await apiRequest('/auth/signup', 'POST', payload, false);
    if (data.token) {
      await setToken(data.token);
    }
    return data;
  },

  login: async (email: string, password: string) => {
    const data = await apiRequest('/auth/login', 'POST', { email, password }, false);
    if (data.token) {
      await setToken(data.token);
    }
    return data;
  },

  getCurrentUser: async () => {
    return await apiRequest('/auth/me', 'GET');
  },

  updateProfile: async (data: { name: string; email: string; profileImage?: string | null }) => {
    return await apiRequest('/auth/me', 'PUT', data);
  },

  logout: async () => {
    await removeToken();
  },
};

// Client API
export const clientAPI = {
  getAll: async () => {
    return await apiRequest('/clients', 'GET');
  },

  add: async (clientData: {
    name: string;
    phone: string;
    email?: string;
    photo?: string;
    membershipType: string;
    startDate: string;
    endDate?: string;  // ← ACCEPT THIS
    fee?: number;      // ← ACCEPT THIS
  }) => {
    return await apiRequest('/clients', 'POST', clientData);
  },

  update: async (id: string, updates: any) => {
    return await apiRequest(`/clients/${id}`, 'PUT', updates);
  },

  delete: async (id: string) => {
    return await apiRequest(`/clients/${id}`, 'DELETE');
  },

  renew: async (id: string, membershipType: string) => {
    return await apiRequest(`/clients/${id}/renew`, 'POST', { membershipType });
  },
};

// Receipt API
export const receiptAPI = {
  getAll: async () => {
    return await apiRequest('/receipts', 'GET');
  },

  getById: async (id: string) => {
    return await apiRequest(`/receipts/${id}`, 'GET');
  },

  getClientReceipts: async (clientId: string) => {
    return await apiRequest(`/receipts/client/${clientId}`, 'GET');
  },
};

// Subscription API
export const subscriptionAPI = {
  get: async () => {
    return await apiRequest('/subscription', 'GET');
  },

  update: async (plan: string, billingCycle?: string) => {
    return await apiRequest('/subscription', 'PUT', { plan, billingCycle });
  },

  canAddClient: async () => {
    return await apiRequest('/subscription/can-add-client', 'GET');
  },
};
