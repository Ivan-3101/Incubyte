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
    } catch (err) {
      alert(err.response?.data?.detail || 'Purchase failed.');
    }
  };
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <main className="container">
      <nav>
        <ul>
          <li><strong>Sweet Shop</strong></li>
        </ul>
        <ul>
          {user && user.is_admin && <li><Link to="/admin">Admin</Link></li>}
          {user ? (
            <li><a href="#" role="button" onClick={handleLogout}>Logout</a></li>
          ) : (
            <>
              <li><Link to="/register">Register</Link></li>
              <li><Link to="/login" role="button">Login</Link></li>
            </>
          )}
        </ul>
      </nav>

      <h1 style={{ textAlign: 'center' }}>Welcome, {user ? user.email : 'Guest'}!</h1>
      
      {user && (
        <>
          <input
            type="search"
            placeholder="Search by name or category..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />

          {error && <p><mark>{error}</mark></p>}
          <div className="grid">
            {sweets.length > 0 ? (
              sweets.map(sweet => (
                <article key={sweet.id}>
                  <header><strong>{sweet.name}</strong></header>
                  <p>Category: {sweet.category}</p>
                  <p>Price: ${sweet.price.toFixed(2)}</p>
                  <p>In Stock: {sweet.quantity}</p>
                  <footer>
                    <button onClick={() => handlePurchase(sweet.id)} disabled={sweet.quantity === 0}>
                      Purchase
                    </button>
                  </footer>
                </article>
              ))
            ) : (
              <p>No sweets found matching your search.</p>
            )}
          </div>
        </>
      )}
    </main>
  );
}