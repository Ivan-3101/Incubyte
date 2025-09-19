// src/pages/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../api';

const emptyFormState = { name: '', category: '', price: '', quantity: '' };

export default function AdminDashboard() {
  const [sweets, setSweets] = useState([]);
  const [formData, setFormData] = useState(emptyFormState);
  const [editingId, setEditingId] = useState(null); // To track which sweet is being edited

  // Fetch all sweets when the component loads
  useEffect(() => {
    fetchSweets();
  }, []);

  const fetchSweets = async () => {
    try {
      const response = await apiClient.get('/sweets');
      setSweets(response.data);
    } catch (error) {
      console.error("Failed to fetch sweets", error);
    }
  };

  // Handle changes in the form inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle form submission for both creating and updating
  const handleSubmit = async (e) => {
    e.preventDefault();
    const sweetData = { ...formData, price: parseFloat(formData.price), quantity: parseInt(formData.quantity) };

    try {
      if (editingId) {
        // If we are editing, send a PUT request
        await apiClient.put(`/sweets/${editingId}`, sweetData);
      } else {
        // If we are creating, send a POST request
        await apiClient.post('/sweets', sweetData);
      }
      // Reset form, clear editing state, and refresh the list
      setFormData(emptyFormState);
      setEditingId(null);
      fetchSweets();
    } catch (error) {
      console.error("Failed to save sweet", error);
      alert(error.response?.data?.detail || "An error occurred.");
    }
  };

  // Set up the form for editing an existing sweet
  const handleEdit = (sweet) => {
    setEditingId(sweet.id);
    setFormData({ name: sweet.name, category: sweet.category, price: sweet.price, quantity: sweet.quantity });
  };

  // Handle deleting a sweet
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this sweet?')) {
      try {
        await apiClient.delete(`/sweets/${id}`);
        fetchSweets(); // Refresh the list
      } catch (error) {
        console.error("Failed to delete sweet", error);
      }
    }
  };
  
  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Admin Dashboard</h1>
      <Link to="/">Back to Home</Link>

      {/* Form for Adding and Editing Sweets */}
      <div style={{ margin: '20px 0', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
        <h2>{editingId ? 'Edit Sweet' : 'Add New Sweet'}</h2>
        <form onSubmit={handleSubmit}>
          <input name="name" value={formData.name} onChange={handleChange} placeholder="Name" required style={{ marginRight: '10px' }} />
          <input name="category" value={formData.category} onChange={handleChange} placeholder="Category" required style={{ marginRight: '10px' }} />
          <input name="price" type="number" step="0.01" value={formData.price} onChange={handleChange} placeholder="Price" required style={{ marginRight: '10px' }} />
          <input name="quantity" type="number" value={formData.quantity} onChange={handleChange} placeholder="Quantity" required style={{ marginRight: '10px' }} />
          <button type="submit">{editingId ? 'Update Sweet' : 'Add Sweet'}</button>
          {editingId && <button onClick={() => { setEditingId(null); setFormData(emptyFormState); }} type="button" style={{ marginLeft: '10px' }}>Cancel Edit</button>}
        </form>
      </div>

      {/* List of Existing Sweets */}
      <div>
        <h2>Existing Sweets</h2>
        {sweets.map(sweet => (
          <div key={sweet.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px', borderBottom: '1-px solid #eee' }}>
            <span>{sweet.name} ({sweet.category}) - ${sweet.price.toFixed(2)} - Stock: {sweet.quantity}</span>
            <div>
              <button onClick={() => handleEdit(sweet)} style={{ marginRight: '10px' }}>Edit</button>
              <button onClick={() => handleDelete(sweet.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}