import React, { useState, useEffect } from 'react';
import { apiCall } from '../services/api';

const HabitManagementPage = () => {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: '', type: '' });

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);

  // Form Fields
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [frequency, setFrequency] = useState('Daily');
  const [target, setTarget] = useState('1 time per day');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [submitting, setSubmitting] = useState(false);

  const fetchHabits = async () => {
    try {
      const data = await apiCall('/habits');
      setHabits(data);
    } catch (err) {
      console.error('Error fetching habits:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHabits();
  }, []);

  const openAddModal = () => {
    setEditingHabit(null);
    setName('');
    setDescription('');
    setFrequency('Daily');
    setTarget('1 time per day');
    setStartDate(new Date().toISOString().split('T')[0]);
    setIsModalOpen(true);
  };

  const openEditModal = (habit) => {
    setEditingHabit(habit);
    setName(habit.name);
    setDescription(habit.description || '');
    setFrequency(habit.frequency || 'Daily');
    setTarget(habit.target || '1 time per day');
    setStartDate(habit.startDate || new Date().toISOString().split('T')[0]);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingHabit(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });

    if (!name || !name.trim()) {
      setMessage({ text: 'Please enter a habit name.', type: 'error' });
      return;
    }

    try {
      setSubmitting(true);
      const payload = { name, description, frequency, target, startDate };

      if (editingHabit) {
        await apiCall(`/habits/${editingHabit._id}`, 'PUT', payload);
        setMessage({ text: 'Habit updated successfully!', type: 'success' });
      } else {
        await apiCall('/habits', 'POST', payload);
        setMessage({ text: 'New habit added successfully!', type: 'success' });
      }

      closeModal();
      await fetchHabits();
    } catch (err) {
      setMessage({ text: err.message || 'Something went wrong. Please try again.', type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this habit?')) {
      return;
    }

    try {
      await apiCall(`/habits/${id}`, 'DELETE');
      setMessage({ text: 'Habit deleted.', type: 'success' });
      await fetchHabits();
    } catch (err) {
      setMessage({ text: err.message || 'Could not delete habit.', type: 'error' });
    }
  };

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 className="page-title">Habit Management 📝</h1>
          <p className="page-subtitle">Create, edit, and organize your daily productivity habits.</p>
        </div>
        <button className="btn btn-primary" onClick={openAddModal}>
          + Create Habit
        </button>
      </div>

      {message.text && (
        <div className={`alert alert-${message.type}`}>
          {message.text}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>Loading your habits...</div>
      ) : habits.length > 0 ? (
        <div className="habit-list">
          {habits.map((habit) => (
            <div key={habit._id} className="habit-item">
              <div className="habit-info">
                <span style={{ fontSize: '1.4rem' }}>🌿</span>
                <div>
                  <div className="habit-name">{habit.name}</div>
                  <div className="habit-details">
                    {habit.description && `${habit.description} • `}
                    <strong>Frequency:</strong> {habit.frequency} • <strong>Target:</strong> {habit.target}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="btn btn-outline btn-sm" onClick={() => openEditModal(habit)}>
                  Edit
                </button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(habit._id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>No active habits found. Start by creating one!</p>
          <button className="btn btn-primary" onClick={openAddModal}>
            + Add Habit
          </button>
        </div>
      )}

      {/* Modal Form for Add/Edit */}
      {isModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <div className="modal-header">
              <h3 style={{ margin: 0 }}>{editingHabit ? 'Edit Habit' : 'Create New Habit'}</h3>
              <button className="modal-close" onClick={closeModal}>✕</button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label" htmlFor="habit-name">Habit Name *</label>
                <input
                  id="habit-name"
                  type="text"
                  className="form-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Drink 2L Water, Read 20 Pages"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="habit-desc">Description (Optional)</label>
                <input
                  id="habit-desc"
                  type="text"
                  className="form-input"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Keep a water bottle at desk"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="habit-freq">Frequency</label>
                  <select
                    id="habit-freq"
                    className="form-select"
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value)}
                  >
                    <option value="Daily">Daily</option>
                    <option value="Weekdays">Weekdays</option>
                    <option value="Weekly">Weekly</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="habit-target">Target</label>
                  <input
                    id="habit-target"
                    type="text"
                    className="form-input"
                    value={target}
                    onChange={(e) => setTarget(e.target.value)}
                    placeholder="e.g. 1 time per day"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="habit-date">Start Date</label>
                <input
                  id="habit-date"
                  type="date"
                  className="form-input"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                <button type="button" className="btn btn-outline" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Saving...' : editingHabit ? 'Update Habit' : 'Create Habit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HabitManagementPage;
