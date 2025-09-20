import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../api';

const emptyFormState = { name: '', category: '', price: '', quantity: '' };

export default function AdminDashboard() {
  const [sweets, setSweets] = useState([]);
  const [formData, setFormData] = useState(emptyFormState);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchSweets();
  }, []);

  const fetchSweets = async () => {
    const response = await apiClient.get('/sweets');
    setSweets(response.data);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const sweetData = { ...formData, price: parseFloat(formData.price), quantity: parseInt(formData.quantity) };
    try {
      if (editingId) {
        await apiClient.put(`/sweets/${editingId}`, sweetData);
      } else {
        await apiClient.post('/sweets', sweetData);
      }
      setFormData(emptyFormState);
      setEditingId(null);
      fetchSweets();
    } catch (error) {
      alert(error.response?.data?.detail || "An error occurred.");
    }
  };

  const handleEdit = (sweet) => {
    setEditingId(sweet.id);
    setFormData({ name: sweet.name, category: sweet.category, price: sweet.price, quantity: sweet.quantity });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this sweet?')) {
      await apiClient.delete(`/sweets/${id}`);
      fetchSweets();
    }
  };

  return (
    <main className="container">
      <nav>
        <ul><li><strong>Admin Dashboard</strong></li></ul>
        <ul><li><Link to="/">Back to Home</Link></li></ul>
      </nav>
      
      <article>
        <header>{editingId ? 'Edit Sweet' : 'Add New Sweet'}</header>
        <form onSubmit={handleSubmit}>
          <div className="grid">
            <input name="name" value={formData.name} onChange={handleChange} placeholder="Name" required />
            <input name="category" value={formData.category} onChange={handleChange} placeholder="Category" required />
          </div>
          <div className="grid">
            <input name="price" type="number" step="0.01" value={formData.price} onChange={handleChange} placeholder="Price" required />
            <input name="quantity" type="number" value={formData.quantity} onChange={handleChange} placeholder="Quantity" required />
          </div>
          <div className="grid">
            <button type="submit">{editingId ? 'Update Sweet' : 'Add Sweet'}</button>
            {editingId && <button type="button" className="secondary" onClick={() => { setEditingId(null); setFormData(emptyFormState); }}>Cancel Edit</button>}
          </div>
        </form>
      </article>

      <h2>Existing Sweets</h2>
      {sweets.map(sweet => (
        <article key={sweet.id}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <strong>{sweet.name}</strong><br />
              <small>Stock: {sweet.quantity} | Price: ${sweet.price.toFixed(2)}</small>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button className="secondary" style={{ margin: 0 }} onClick={() => handleEdit(sweet)}>Edit</button>
              <button className="contrast" style={{ margin: 0 }} onClick={() => handleDelete(sweet.id)}>Delete</button>
            </div>
          </div>
        </article>
      ))}
    </main>
  );
}