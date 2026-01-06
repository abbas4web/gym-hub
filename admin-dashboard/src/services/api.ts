import axios from 'axios';

const API_URL = 'https://gym-hub-backend-prod.vercel.app/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('superAdminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('superAdminToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const superAdminAPI = {
  // Auth
  login: async (email: string, password: string) => {
    const { data } = await api.post('/super-admin/login', { email, password });
    return data;
  },

  getMe: async () => {
    const { data } = await api.get('/super-admin/me');
    return data;
  },

  // Admins
  getAdmins: async (params?: { search?: string; status?: string; page?: number }) => {
    const { data } = await api.get('/super-admin/admins', { params });
    return data;
  },

  getAdminById: async (id: string) => {
    const { data } = await api.get(`/super-admin/admins/${id}`);
    return data;
  },

  updateAdminStatus: async (id: string, status: string) => {
    const { data } = await api.put(`/super-admin/admins/${id}/status`, { status });
    return data;
  },

  // Analytics
  getDashboardStats: async () => {
    const { data } = await api.get('/super-admin/analytics/overview');
    return data;
  },
};

export default api;
