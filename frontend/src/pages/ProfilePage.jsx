import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { apiCall } from '../services/api';

const ProfilePage = () => {
  const { user, refreshUser } = useContext(AuthContext);
  const [name, setName] = useState(user?.name || '');
  const [message, setMessage] = useState({ text: '', type: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });

    if (!name || !name.trim()) {
      setMessage({ text: 'Please enter a valid name.', type: 'error' });
      return;
    }

    try {
      setSubmitting(true);
      await apiCall('/users/profile', 'PUT', { name });
      await refreshUser();
      setMessage({ text: 'Profile updated successfully!', type: 'success' });
    } catch (err) {
      setMessage({ text: err.message || 'Could not update profile.', type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  const formattedDate = user?.createdAt 
    ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : 'Recently';

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div className="page-header">
        <h1 className="page-title">User Profile 👤</h1>
        <p className="page-subtitle">Manage your personal details and view your overall stats.</p>
      </div>

      {message.text && (
        <div className={`alert alert-${message.type}`}>
          {message.text}
        </div>
      )}

      {/* Account Info Card */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: 'var(--light-green)', color: 'var(--primary-green)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem', fontWeight: 700 }}>
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <h2 style={{ fontSize: '1.3rem' }}>{user?.name}</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{user?.email}</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', textAlign: 'center', padding: '16px', backgroundColor: 'var(--bg-color)', borderRadius: 'var(--radius-sm)' }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: '1.2rem', color: 'var(--primary-green)' }}>{user?.points || 0}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Total Points</div>
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '1.2rem', color: 'var(--amber-accent)' }}>{user?.currentStreak || 0}d</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Current Streak</div>
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '1.2rem', color: 'var(--text-primary)' }}>{user?.longestStreak || 0}d</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Longest Streak</div>
          </div>
        </div>

        <div style={{ marginTop: '16px', fontSize: '0.85rem', color: 'var(--text-secondary)', textAlign: 'right' }}>
          Member since: <strong>{formattedDate}</strong>
        </div>
      </div>

      {/* Edit Profile Form */}
      <div className="card">
        <h3 style={{ marginBottom: '16px' }}>Edit Profile</h3>

        <form onSubmit={handleUpdate}>
          <div className="form-group">
            <label className="form-label" htmlFor="profile-name">Full Name</label>
            <input
              id="profile-name"
              type="text"
              className="form-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="profile-email">Email Address (Read-only)</label>
            <input
              id="profile-email"
              type="email"
              className="form-input"
              value={user?.email || ''}
              disabled
              style={{ backgroundColor: '#edf2f7', cursor: 'not-allowed' }}
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? 'Updating...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
