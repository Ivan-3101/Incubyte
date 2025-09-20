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
  const [loading, setLoading] = useState(false);

  // Fetch sweets when user logs in or search term changes
  useEffect(() => {
    if (user) {
      fetchSweets();
    }
  }, [user, searchTerm]);

  const fetchSweets = async () => {
    setLoading(true);
    setError('');
    
    try {
      let response;
      if (searchTerm.trim() === '') {
        // If no search term, get all sweets
        response = await apiClient.get('/sweets');
      } else {
        // Make two separate API calls and combine results
        const [nameResults, categoryResults] = await Promise.all([
          apiClient.get('/sweets/search', { params: { name: searchTerm } }).catch(() => ({ data: [] })),
          apiClient.get('/sweets/search', { params: { category: searchTerm } }).catch(() => ({ data: [] }))
        ]);
        
        // Combine and deduplicate results
        const combinedResults = [...nameResults.data, ...categoryResults.data];
        const uniqueResults = combinedResults.filter((sweet, index, self) => 
          index === self.findIndex(s => s.id === sweet.id)
        );
        
        response = { data: uniqueResults };
      }
      setSweets(response.data);
    } catch (err) {
      setError('Failed to load sweets. Please try again.');
      console.error('Error fetching sweets:', err);
      setSweets([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  const handlePurchase = async (sweetId) => {
    try {
      const response = await apiClient.post(`/sweets/${sweetId}/purchase`, { amount: 1 });
      const updatedSweet = response.data;
      
      // Update the sweet in current results
      setSweets(currentSweets =>
        currentSweets.map(sweet => sweet.id === sweetId ? updatedSweet : sweet)
      );
      
      // Show success message
      showMessage('Purchase successful!', 'success');
    } catch (err) {
      showMessage(err.response?.data?.detail || 'Purchase failed.', 'error');
    }
  };

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
              <div style={{position: 'relative', maxWidth: '500px', margin: '0 auto'}}>
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search by name or category..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
                {searchTerm && (
                  <button
                    onClick={clearSearch}
                    style={{
                      position: 'absolute',
                      right: '20px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: '#6c757d',
                      cursor: 'pointer',
                      fontSize: '1.2rem',
                      padding: '5px'
                    }}
                    title="Clear search"
                  >
                    ✕
                  </button>
                )}
              </div>
              
              {searchTerm && !loading && (
                <p style={{marginTop: '1rem', color: '#6c757d', textAlign: 'center'}}>
                  {sweets.length} result{sweets.length !== 1 ? 's' : ''} found for "{searchTerm}"
                </p>
              )}
            </section>

            {error && (
              <div className="message error">
                {error}
                <button 
                  onClick={fetchSweets}
                  style={{
                    marginLeft: '10px',
                    background: 'none',
                    border: 'none',
                    color: '#721c24',
                    cursor: 'pointer',
                    textDecoration: 'underline'
                  }}
                >
                  Retry
                </button>
              </div>
            )}

            {loading ? (
              <div style={{textAlign: 'center', padding: '3rem'}}>
                <span className="loading" style={{width: '40px', height: '40px'}}></span>
                <p style={{marginTop: '1rem', color: '#6c757d'}}>
                  {searchTerm ? 'Searching...' : 'Loading sweets...'}
                </p>
              </div>
            ) : (
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
                  <div style={{gridColumn: '1 / -1', textAlign: 'center', padding: '3rem'}}>
                    <div className="message" style={{background: '#e9ecef', color: '#495057', border: 'none'}}>
                      {searchTerm ? 
                        `No sweets found matching "${searchTerm}". Try a different search term.` : 
                        'No sweets available at the moment.'
                      }
                    </div>
                  </div>
                )}
              </section>
            )}
          </>
        )}
      </main>
    </>
  );
}