import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../api';

const emptyFormState = { name: '', category: '', price: '', quantity: '' };

export default function AdminDashboard() {
  const [sweets, setSweets] = useState([]);
  const [formData, setFormData] = useState(emptyFormState);
  const [editingId, setEditingId] = useState(null);
  const [restockingId, setRestockingId] = useState(null);
  const [restockAmount, setRestockAmount] = useState('');

  useEffect(() => {
    fetchSweets();
  }, []);

  const fetchSweets = async () => {
    try {
      const response = await apiClient.get('/sweets');
      setSweets(response.data);
    } catch (error) {
      showMessage('Failed to load sweets.', 'error');
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const sweetData = { 
      ...formData, 
      price: parseFloat(formData.price), 
      quantity: parseInt(formData.quantity) 
    };
    
    try {
      if (editingId) {
        await apiClient.put(`/sweets/${editingId}`, sweetData);
        showMessage('Sweet updated successfully!', 'success');
      } else {
        await apiClient.post('/sweets', sweetData);
        showMessage('Sweet added successfully!', 'success');
      }
      setFormData(emptyFormState);
      setEditingId(null);
      fetchSweets();
    } catch (error) {
      showMessage(error.response?.data?.detail || "An error occurred.", 'error');
    }
  };

  const handleEdit = (sweet) => {
    setEditingId(sweet.id);
    setFormData({ 
      name: sweet.name, 
      category: sweet.category, 
      price: sweet.price.toString(), 
      quantity: sweet.quantity.toString() 
    });
    
    // Scroll to form
    document.querySelector('.form-container').scrollIntoView({ behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this sweet?')) {
      try {
        await apiClient.delete(`/sweets/${id}`);
        showMessage('Sweet deleted successfully!', 'success');
        fetchSweets();
      } catch (error) {
        showMessage('Failed to delete sweet.', 'error');
      }
    }
  };

  const handleRestock = async (id) => {
    const amount = parseInt(restockAmount);
    if (!amount || amount <= 0) {
      showMessage('Please enter a valid restock amount.', 'error');
      return;
    }

    try {
      await apiClient.post(`/sweets/${id}/restock`, { amount });
      showMessage(`Successfully restocked ${amount} items!`, 'success');
      setRestockingId(null);
      setRestockAmount('');
      fetchSweets();
    } catch (error) {
      showMessage(error.response?.data?.detail || 'Failed to restock sweet.', 'error');
    }
  };

  const startRestock = (sweetId) => {
    setRestockingId(sweetId);
    setRestockAmount('');
  };

  const cancelRestock = () => {
    setRestockingId(null);
    setRestockAmount('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData(emptyFormState);
  };

  return (
    <>
      <nav className="navbar">
        <div className="container">
          <div className="nav-content">
            <Link to="/" className="logo">Sweet Dreams</Link>
            <div className="nav-links">
              <Link to="/" className="nav-link">Back to Shop</Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="container">
        <div className="admin-header">
          <h1>Admin Dashboard</h1>
          <p>Manage your sweet inventory</p>
        </div>
        
        <section className="form-container">
          <h2 className="form-title">
            {editingId ? 'Edit Sweet' : 'Add New Sweet'}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <input 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange} 
                  placeholder="Sweet Name" 
                  className="form-input"
                  required 
                />
              </div>
              <div className="form-group">
                <input 
                  name="category" 
                  value={formData.category} 
                  onChange={handleChange} 
                  placeholder="Category" 
                  className="form-input"
                  required 
                />
              </div>
            </div>
            <div className="form-grid">
              <div className="form-group">
                <input 
                  name="price" 
                  type="number" 
                  step="0.01" 
                  value={formData.price} 
                  onChange={handleChange} 
                  placeholder="Price" 
                  className="form-input"
                  required 
                />
              </div>
              <div className="form-group">
                <input 
                  name="quantity" 
                  type="number" 
                  value={formData.quantity} 
                  onChange={handleChange} 
                  placeholder="Quantity" 
                  className="form-input"
                  required 
                />
              </div>
            </div>
            <div className="form-grid">
              <button type="submit" className="btn btn-primary" style={{fontSize: '1.1rem'}}>
                {editingId ? 'Update Sweet' : 'Add Sweet'}
              </button>
              {editingId && (
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={cancelEdit}
                  style={{fontSize: '1.1rem'}}
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        </section>

        <section>
          <div className="admin-header" style={{margin: '2rem 0 1rem 0'}}>
            <h2 style={{fontSize: '2rem', color: '#2c3e50'}}>Existing Sweets</h2>
          </div>
          
          {sweets.length > 0 ? (
            sweets.map(sweet => (
              <div key={sweet.id} className="sweet-item">
                <div className="sweet-info">
                  <div className="sweet-name">{sweet.name}</div>
                  <div className="sweet-details">
                    Stock: {sweet.quantity} | Price: ${sweet.price.toFixed(2)} | Category: {sweet.category}
                  </div>
                </div>

                {restockingId === sweet.id ? (
                  // Restock mode
                  <div className="action-buttons" style={{alignItems: 'center', gap: '0.5rem'}}>
                    <input
                      type="number"
                      placeholder="Amount"
                      value={restockAmount}
                      onChange={(e) => setRestockAmount(e.target.value)}
                      style={{
                        padding: '0.5rem',
                        border: '2px solid #4ecdc4',
                        borderRadius: '6px',
                        width: '80px',
                        fontSize: '0.9rem'
                      }}
                      min="1"
                    />
                    <button 
                      className="btn-edit" 
                      onClick={() => handleRestock(sweet.id)}
                      style={{padding: '0.5rem 0.8rem'}}
                    >
                      Add
                    </button>
                    <button 
                      className="btn-delete" 
                      onClick={cancelRestock}
                      style={{padding: '0.5rem 0.8rem'}}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  // Normal mode
                  <div className="action-buttons">
                    <button className="btn-edit" onClick={() => handleEdit(sweet)}>
                      Edit
                    </button>
                    <button 
                      className="btn-restock"
                      onClick={() => startRestock(sweet.id)}
                      style={{
                        background: '#28a745',
                        color: 'white',
                        padding: '0.6rem 1.2rem',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: '600',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseOver={(e) => {
                        e.target.style.background = '#218838';
                        e.target.style.transform = 'scale(1.05)';
                      }}
                      onMouseOut={(e) => {
                        e.target.style.background = '#28a745';
                        e.target.style.transform = 'scale(1)';
                      }}
                    >
                      Restock
                    </button>
                    <button className="btn-delete" onClick={() => handleDelete(sweet.id)}>
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="message" style={{background: '#e9ecef', color: '#495057', border: 'none'}}>
              No sweets in inventory. Add some above!
            </div>
          )}
        </section>
      </main>
    </>
  );
}