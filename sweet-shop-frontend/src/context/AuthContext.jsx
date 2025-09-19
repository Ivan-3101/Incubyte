// src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import apiClient from '../api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      apiClient.get('/auth/me')
        .then(response => setUser(response.data))
        .catch(() => {
          localStorage.removeItem('token');
          setUser(null);
        });
    }
  }, []);

  const login = async (email, password) => {
    const formData = new URLSearchParams();
    formData.append('username', email);
    formData.append('password', password);

    const response = await apiClient.post('/auth/login', formData);
    localStorage.setItem('token', response.data.access_token);

    const userResponse = await apiClient.get('/auth/me');
    setUser(userResponse.data);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);