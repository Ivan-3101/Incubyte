import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import apiClient from '../api';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const showMessage = (text, type) => {
    const message = document.createElement('div');
    message.className = `message ${type}`;
    message.textContent = text;
    message.style.position = 'fixed';
    message.style.top = '20px';
    message.style.right = '20px';
    message.style.zIndex = '10000';
    document.body.appendChild(message);
    
    setTimeout(() => {
      message.remove();
    }, 3000);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    
    const email = event.target.email.value;
    const password = event.target.password.value;
    const confirmPassword = event.target.confirmPassword?.value;

    // Client-side validation
    if (confirmPassword && password !== confirmPassword) {
      showMessage('Passwords do not match!', 'error');
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      showMessage('Password must be at least 6 characters long!', 'error');
      setIsLoading(false);
      return;
    }

    try {
      await apiClient.post('/auth/register', { email, password });
      showMessage('Registration successful! Redirecting to login...', 'success');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      showMessage(
        error.response?.data?.detail || 'Registration failed. Please try again.', 
        'error'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Join Sweet Dreams</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input 
              type="email" 
              name="email" 
              id="email" 
              placeholder="Enter your email"
              className="form-input"
              required 
              disabled={isLoading}
            />
          </div>
          <div className="form-group">
            <input 
              type="password" 
              name="password" 
              id="password" 
              placeholder="Create a password (min 6 characters)"
              className="form-input"
              required 
              minLength="6"
              disabled={isLoading}
            />
          </div>
          <div className="form-group">
            <input 
              type="password" 
              name="confirmPassword" 
              id="confirmPassword" 
              placeholder="Confirm your password"
              className="form-input"
              required 
              minLength="6"
              disabled={isLoading}
            />
          </div>
          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{width: '100%', fontSize: '1.1rem'}}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="loading" style={{marginRight: '10px'}}></span>
                Creating Account...
              </>
            ) : (
              'Create Account'
            )}
          </button>
        </form>
        <div className="auth-link">
          Already have an account? <Link to="/login">Sign in here</Link>
        </div>
      </div>
    </div>
  );
}