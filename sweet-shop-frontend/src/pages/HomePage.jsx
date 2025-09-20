import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import apiClient from '../api';
import { useAuth } from '../context/AuthContext';

export default function HomePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sweets, setSweets] = useState([]);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (user) {
      apiClient.get('/sweets/search', { params: { name: searchTerm, category: searchTerm } })
        .then(response => setSweets(response.data))
        .catch(err => setError('Failed to load sweets.'));
    }
  }, [user, searchTerm]);

  const handlePurchase = async (sweetId) => {
    try {
      const response = await apiClient.post(`/sweets/${sweetId}/purchase`, { amount: 1 });
      const updatedSweet = response.data;
      setSweets(currentSweets =>
        currentSweets.map(sweet => sweet.id === sweetId ? updatedSweet : sweet)
      );
      
      // Show success message
      const message = document.createElement('div');
      message.className = 'message success';
      message.textContent = 'Purchase successful!';
      message.style.position = 'fixed';
      message.style.top = '20px';
      message.style.right = '20px';
      message.style.zIndex = '10000';
      document.body.appendChild(message);
      
      setTimeout(() => {
        message.remove();
      }, 3000);
    } catch (err) {
      const message = document.createElement('div');
      message.className = 'message error';
      message.textContent = err.response?.data?.detail || 'Purchase failed.';
      message.style.position = 'fixed';
      message.style.top = '20px';
      message.style.right = '20px';
      message.style.zIndex = '10000';
      document.body.appendChild(message);
      
      setTimeout(() => {
        message.remove();
      }, 3000);
    }
  };
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <nav className="navbar">
        <div className="container">
          <div className="nav-content">
            <Link to="/" className="logo">Sweet Dreams</Link>
            <div className="nav-links">
              {user && user.is_admin && (
                <Link to="/admin" className="nav-link">Admin Dashboard</Link>
              )}
              {user ? (
                <button onClick={handleLogout} className="btn btn-primary">
                  Logout ({user.email})
                </button>
              ) : (
                <>
                  <Link to="/register" className="nav-link">Register</Link>
                  <Link to="/login" className="btn btn-primary">Login</Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="container">
        <section className="hero">
          <h1>Welcome to Sweet Dreams</h1>
          <p>
            {user ? `Hello, ${user.email}! Discover our delicious collection` : 'Please login to explore our delicious treats'}
          </p>
          {!user && (
            <Link to="/login" className="btn btn-primary" style={{fontSize: '1.2rem', padding: '1rem 3rem'}}>
              Start Shopping
            </Link>
          )}
        </section>

        {user && (
          <>
            <section className="search-container">
              <input
                type="text"
                className="search-input"
                placeholder="Search by name or category..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </section>

            {error && (
              <div className="message error">
                {error}
              </div>
            )}

            <section className="cards-grid">
              {sweets.length > 0 ? (
                sweets.map(sweet => (
                  <article key={sweet.id} className="sweet-card">
                    <div className="card-header">
                      <h3 className="card-title">{sweet.name}</h3>
                      <p className="card-category">{sweet.category}</p>
                    </div>
                    <div className="card-body">
                      <div className="price-tag">${sweet.price.toFixed(2)}</div>
                      <div className="stock-info">
                        <span className={`stock-badge ${sweet.quantity > 0 ? 'in-stock' : 'out-of-stock'}`}>
                          {sweet.quantity > 0 ? `In Stock: ${sweet.quantity}` : 'Out of Stock'}
                        </span>
                      </div>
                      <button 
                        onClick={() => handlePurchase(sweet.id)} 
                        disabled={sweet.quantity === 0}
                        className={`btn ${sweet.quantity > 0 ? 'btn-primary' : 'btn-secondary'}`}
                        style={{width: '100%'}}
                      >
                        {sweet.quantity > 0 ? 'Purchase Now' : 'Sold Out'}
                      </button>
                    </div>
                  </article>
                ))
              ) : (
                <div style={{gridColumn: '1 / -1', textAlign: 'center', color: 'white', fontSize: '1.2rem'}}>
                  {searchTerm ? 'No sweets found matching your search.' : 'No sweets available at the moment.'}
                </div>
              )}
            </section>
          </>
        )}
      </main>
    </>
  );
}