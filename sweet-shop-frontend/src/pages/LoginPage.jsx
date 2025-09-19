// src/pages/LoginPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import useAuth

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth(); // Get the login function from context

  const handleSubmit = async (event) => {
    event.preventDefault();
    const email = event.target.email.value;
    const password = event.target.password.value;

    try {
      await login(email, password); // Use the context login function
      alert('Login successful!');
      navigate('/');
    } catch (error) {
      console.error('Login failed:', error);
      alert(`Login failed.`);
    }
  };

  // ... keep the return (...) JSX the same
  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input type="email" name="email" required />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" name="password" required />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}