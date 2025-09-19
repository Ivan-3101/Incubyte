// src/pages/HomePage.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import apiClient from '../api';
import { useAuth } from '../context/AuthContext';

export default function HomePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sweets, setSweets] = useState([]);
  const [error, setError] = useState('');
  
  // --- NEW: State for search filters ---
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (user) {
      // Use the new search endpoint
      apiClient.get('/sweets/search', { params: { name: searchTerm } })
        .then(response => {
          setSweets(response.data);
        })
        .catch(err => {
          console.error('Failed to fetch sweets:', err);
          setError('Failed to load sweets. You may need to log in again.');
        });
    }
  }, [user, searchTerm]); // The effect re-runs when the user or searchTerm changes

  // ... (keep handlePurchase and handleLogout functions the same) ...
  const handlePurchase = async (sweetId) => {
    try {
      const response = await apiClient.post(`/sweets/${sweetId}/purchase`, { amount: 1 });
      const updatedSweet = response.data;
      setSweets(currentSweets =>
        currentSweets.map(sweet =>
          sweet.id === sweetId ? updatedSweet : sweet
        )
      );
    } catch (err) {
      console.error('Purchase failed:', err);
      alert(err.response?.data?.detail || 'Purchase failed.');
    }
  };
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Welcome to the Sweet Shop!</h1>
      {!user ? (
        <nav>
          <Link to="/register">Register</Link> | <Link to="/login">Login</Link>
        </nav>
      ) : (
        <div>
          <nav style={{ marginBottom: '20px', paddingBottom: '10px', borderBottom: '1px solid #eee' }}>
            <span>Welcome, {user.email}!</span>
            {user.is_admin && <Link to="/admin" style={{ margin: '0 10px' }}>Admin Dashboard</Link>}
            <button onClick={handleLogout} style={{ marginLeft: '10px' }}>Logout</button>
          </nav>

          <h2>Available Sweets</h2>
          
          {/* --- NEW: Search Input --- */}
          <div style={{ marginBottom: '20px' }}>
            <input
              type="text"
              placeholder="Search by name..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{ padding: '8px', width: '300px' }}
            />
          </div>

          {error && <p style={{ color: 'red' }}>{error}</p>}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
            {sweets.length > 0 ? (
              sweets.map(sweet => (
                <div key={sweet.id} style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '15px', width: '220px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                  <h3>{sweet.name}</h3>
                  <p>Category: {sweet.category}</p>
                  <p>Price: ${sweet.price.toFixed(2)}</p>
                  <p>In Stock: {sweet.quantity}</p>
                  <button onClick={() => handlePurchase(sweet.id)} disabled={sweet.quantity === 0}>
                    Purchase
                  </button>
                </div>
              ))
            ) : (
              <p>No sweets found matching your search.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}