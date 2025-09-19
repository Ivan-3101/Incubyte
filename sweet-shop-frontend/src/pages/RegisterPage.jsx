// src/pages/RegisterPage.jsx
import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function RegisterPage() {
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const email = event.target.email.value;
    const password = event.target.password.value;

    try {
      await axios.post('http://127.0.0.1:8000/api/auth/register', { email, password });
      alert('Registration successful! Please log in.');
      navigate('/login'); // Redirect to login page after successful registration
    } catch (error) {
      console.error('Registration failed:', error.response.data.detail);
      alert(`Registration failed: ${error.response.data.detail}`);
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input type="email" name="email" required />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" name="password" required />
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
}