import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080', // Replace with your backend URL
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Ensures cookies are sent with requests
});

// Add token to headers if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Login API
export const login = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
  }
  return response;
};

// Register API
export const register = async (userDetails) => {
  return await api.post('/auth/addNewUser', userDetails);
};

// Get user profile API
export const getProfile = async () => {
  return await api.get('/auth/profile');
};

// Add customer API
export const addCustomer = async (customerDetails) => {
  return await api.post('/customers', customerDetails);
};

// Logout function
export const signOut = () => {
  localStorage.removeItem('token'); // Remove the token from localStorage
};

export default api;
