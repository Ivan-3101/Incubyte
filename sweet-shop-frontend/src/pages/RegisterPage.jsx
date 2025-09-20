import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import apiClient from '../api';

export default function RegisterPage() {
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const email = event.target.email.value;
    const password = event.target.password.value;

    try {
      await apiClient.post('/auth/register', { email, password });
      alert('Registration successful! Please log in.');
      navigate('/login');
    } catch (error) {
      alert(`Registration failed: ${error.response.data.detail}`);
    }
  };

  return (
    <main className="container" style={{ maxWidth: '500px', margin: '5rem auto' }}>
      <article>
        <h2 style={{ textAlign: 'center' }}>Register</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="email">
            Email:
            <input type="email" name="email" id="email" required />
          </label>
          <label htmlFor="password">
            Password:
            <input type="password" name="password" id="password" required />
          </label>
          <button type="submit">Register</button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '1rem' }}>
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </article>
    </main>
  );
}