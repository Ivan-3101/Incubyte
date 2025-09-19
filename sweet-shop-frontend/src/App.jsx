// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'; // Import AuthProvider
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <AuthProvider> {/* Wrap everything in the provider */}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin" element={<AdminDashboard />} /> {/* <-- Add the admin route */}
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;