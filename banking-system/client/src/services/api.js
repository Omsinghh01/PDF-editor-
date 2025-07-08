import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Authentication APIs
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/profile'),
};

// Account APIs
export const accountAPI = {
  getAccounts: () => api.get('/accounts'),
  createAccount: (accountType) => api.post('/accounts', { accountType }),
  getBalance: (accountNumber) => api.get(`/accounts/${accountNumber}/balance`),
};

// Transaction APIs
export const transactionAPI = {
  deposit: (data) => api.post('/transactions/deposit', data),
  withdraw: (data) => api.post('/transactions/withdraw', data),
  transfer: (data) => api.post('/transactions/transfer', data),
  getHistory: (accountNumber, params = {}) => 
    api.get(`/transactions/${accountNumber}`, { params }),
};

// Health check
export const healthAPI = {
  check: () => api.get('/health'),
};

export default api;