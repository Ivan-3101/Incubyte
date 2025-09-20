import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
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

    try {
      await login(email, password);
      showMessage('Login successful! Redirecting...', 'success');
      setTimeout(() => {
        navigate('/');
      }, 1000);
    } catch (error) {
      console.error('Login failed:', error);
      showMessage(error.response?.data?.detail || 'Login failed. Please check your credentials.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Welcome Back</h2>
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
              placeholder="Enter your password"
              className="form-input"
              required 
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
                Logging in...
              </>
            ) : (
              'Login'
            )}
          </button>
        </form>
        <div className="auth-link">
          Don't have an account? <Link to="/register">Create one here</Link>
        </div>
      </div>
    </div>
  );
}