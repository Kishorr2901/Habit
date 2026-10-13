import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { apiCall } from '../services/api';
import GardenDisplay from '../components/GardenDisplay';

const DashboardPage = () => {
  const { user, refreshUser } = useContext(AuthContext);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [actionId, setActionId] = useState(null);

  const fetchDashboard = async () => {
    try {
      const data = await apiCall('/dashboard');
      setDashboardData(data);
    } catch (err) {
      console.error('Error fetching dashboard:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleCompleteHabit = async (habitId) => {
    setMessage({ text: '', type: '' });
    setActionId(habitId);

    try {
      const result = await apiCall(`/habits/${habitId}/complete`, 'POST');
      setMessage({ text: result.message, type: 'success' });
      await refreshUser();
      await fetchDashboard();
    } catch (err) {
      setMessage({ text: err.message || 'Could not complete habit.', type: 'error' });
    } finally {
      setActionId(null);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 0' }}>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>Loading your garden dashboard... 🌱</p>
      </div>
    );
  }

  const { stats, todayHabits, gardenStage } = dashboardData || {};

  return (
    <div>
      {/* Top Greeting */}
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 className="page-title">Good morning, {user?.name || 'Friend'} 🌱</h1>
          <p className="page-subtitle">Keep your habits going, one day at a time.</p>
        </div>
        <Link to="/habits" className="btn btn-primary btn-sm">
          + Add New Habit
        </Link>
      </div>

      {message.text && (
        <div className={`alert alert-${message.type}`}>
          {message.text}
        </div>
      )}

      {/* Summary Metrics */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div>
            <div className="stat-value">{stats?.completionPercentage || 0}%</div>
            <div className="stat-label">Today's Completion</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🔥</div>
          <div>
            <div className="stat-value">{stats?.currentStreak || 0} Days</div>
            <div className="stat-label">Current Streak</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⭐</div>
          <div>
            <div className="stat-value">{user?.points || 0}</div>
            <div className="stat-label">Total Points</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🎯</div>
          <div>
            <div className="stat-value">{stats?.totalActive || 0}</div>
            <div className="stat-label">Active Habits</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {/* Main Section: Today's Habits */}
        <div className="card">
          <h3 style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Today's Habits</span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 400 }}>
              {stats?.completedTodayCount || 0} of {stats?.totalActive || 0} done
            </span>
          </h3>

          {todayHabits && todayHabits.length > 0 ? (
            <div className="habit-list">
              {todayHabits.map((habit) => (
                <div key={habit._id} className={`habit-item ${habit.completedToday ? 'completed' : ''}`}>
                  <div className="habit-info">
                    <button
                      className={`habit-check-btn ${habit.completedToday ? 'done' : ''}`}
                      onClick={() => !habit.completedToday && handleCompleteHabit(habit._id)}
                      disabled={habit.completedToday || actionId === habit._id}
                      title={habit.completedToday ? 'Already completed today' : 'Click to complete'}
                    >
                      {habit.completedToday ? '✓' : ''}
                    </button>
                    <div>
                      <div className="habit-name">{habit.name}</div>
                      <div className="habit-details">
                        {habit.description || habit.target || 'Daily habit'}
                      </div>
                    </div>
                  </div>

                  <div>
                    {habit.completedToday ? (
                      <span style={{ fontSize: '0.8rem', color: 'var(--primary-green)', fontWeight: 600, backgroundColor: 'var(--light-green)', padding: '4px 8px', borderRadius: '4px' }}>
                        +10 pts Earned!
                      </span>
                    ) : (
                      <button
                        className="btn btn-outline btn-sm"
                        onClick={() => handleCompleteHabit(habit._id)}
                        disabled={actionId === habit._id}
                      >
                        {actionId === habit._id ? 'Saving...' : 'Done'}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '30px 10px', color: 'var(--text-secondary)' }}>
              <p style={{ marginBottom: '12px' }}>You haven't added any habits yet!</p>
              <Link to="/habits" className="btn btn-outline btn-sm">
                Create Your First Habit
              </Link>
            </div>
          )}
        </div>

        {/* Right Section: Garden Preview */}
        <div>
          <div className="card" style={{ padding: '20px' }}>
            <h3 style={{ marginBottom: '16px' }}>Garden Preview 🌱</h3>
            <GardenDisplay points={user?.points || 0} />
            <div style={{ textAlign: 'center' }}>
              <Link to="/garden" className="btn btn-outline btn-sm" style={{ width: '100%' }}>
                View Full Garden Page →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
