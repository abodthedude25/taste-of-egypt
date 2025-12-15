const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Get stored token
const getToken = () => localStorage.getItem('tasteOfEgypt_token');

// API request helper
const request = async (endpoint, options = {}) => {
  const token = getToken();
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers
    },
    ...options
  };
  
  const response = await fetch(`${API_URL}${endpoint}`, config);
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'API request failed');
  }
  
  return data;
};

// Auth API
export const authAPI = {
  register: (userData) => request('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData)
  }),
  
  login: (credentials) => request('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials)
  }),
  
  googleLogin: (googleData) => request('/auth/google', {
    method: 'POST',
    body: JSON.stringify(googleData)
  }),
  
  adminLogin: (credentials) => request('/auth/admin', {
    method: 'POST',
    body: JSON.stringify(credentials)
  }),
  
  getProfile: () => request('/auth/me'),
  
  updateProfile: (data) => request('/auth/profile', {
    method: 'PUT',
    body: JSON.stringify(data)
  })
};

// Orders API
export const ordersAPI = {
  getAll: () => request('/orders'),
  
  getOne: (orderId) => request(`/orders/${orderId}`),
  
  create: (orderData) => request('/orders', {
    method: 'POST',
    body: JSON.stringify(orderData)
  }),
  
  cancel: (orderId) => request(`/orders/${orderId}`, {
    method: 'DELETE'
  })
};

// Admin API
export const adminAPI = {
  getOrders: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/admin/orders${query ? `?${query}` : ''}`);
  },
  
  getOrder: (orderId) => request(`/admin/orders/${orderId}`),
  
  updateOrderStatus: (orderId, status) => request(`/admin/orders/${orderId}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status })
  }),
  
  getStats: () => request('/admin/stats'),
  
  getUsers: () => request('/admin/users')
};

// Menu API
export const menuAPI = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/menu${query ? `?${query}` : ''}`);
  },
  
  getCategories: () => request('/menu/categories'),
  
  getOne: (id) => request(`/menu/${id}`)
};

// Token management
export const setToken = (token) => {
  localStorage.setItem('tasteOfEgypt_token', token);
};

export const removeToken = () => {
  localStorage.removeItem('tasteOfEgypt_token');
};

export default {
  auth: authAPI,
  orders: ordersAPI,
  admin: adminAPI,
  menu: menuAPI,
  setToken,
  removeToken
};
