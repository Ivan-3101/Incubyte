// src/pages/LoginPage.jsx
import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const email = event.target.email.value;
    const password = event.target.password.value;

    try {
      await login(email, password);
      alert('Login successful!');
      navigate('/');
    } catch (error) {
      console.error('Login failed:', error);
      alert(`Login failed.`);
    }
  };

  return (
    <main className="container" style={{ maxWidth: '500px', margin: '5rem auto' }}>
      <article>
        <h2 style={{ textAlign: 'center' }}>Login</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="email">
            Email:
            <input type="email" name="email" id="email" required />
          </label>
          <label htmlFor="password">
            Password:
            <input type="password" name="password" id="password" required />
          </label>
          <button type="submit">Login</button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '1rem' }}>
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </article>
    </main>
  );
}