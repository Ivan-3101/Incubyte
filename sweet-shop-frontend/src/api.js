// src/api.js
import axios from 'axios';

const apiClient = axios.create({
  // baseURL: 'http://127.0.0.1:8000/api',
  // Change this from localhost to your live Render URL
  baseURL: 'https://incubyte.onrender.com/api', 
});

// This is an "interceptor" that adds the auth token to every request
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;