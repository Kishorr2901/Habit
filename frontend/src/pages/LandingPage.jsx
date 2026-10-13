import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const LandingPage = () => {
  const { user } = useContext(AuthContext);

  return (
    <div style={{ padding: '40px 0' }}>
      {/* Hero Section */}
      <div className="card" style={{ textAlign: 'center', padding: '50px 20px', backgroundColor: '#f0fdf4', borderColor: '#b7e4c7' }}>
        <div style={{ fontSize: '4rem', marginBottom: '16px' }}>🌱 🌿 🌳 🌸</div>
        <h1 style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--primary-green)', marginBottom: '16px' }}>
          Build small habits. Grow something every day.
        </h1>
        <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto 28px auto' }}>
          Track your daily habits, build streaks and watch your little garden grow.
        </p>

        <div style={{ display: 'flex', gap: '14px', justifyContent: 'center' }}>
          {user ? (
            <Link to="/dashboard" className="btn btn-primary" style={{ padding: '12px 24px', fontSize: '1.05rem' }}>
              Go to Dashboard 🌱
            </Link>
          ) : (
            <>
              <Link to="/register" className="btn btn-primary" style={{ padding: '12px 24px', fontSize: '1.05rem' }}>
                Start Growing
              </Link>
              <Link to="/login" className="btn btn-outline" style={{ padding: '12px 24px', fontSize: '1.05rem' }}>
                Login
              </Link>
            </>
          )}
        </div>
      </div>

      {/* How It Works Section */}
      <div style={{ marginTop: '50px' }}>
        <h2 style={{ textAlign: 'center', fontSize: '1.6rem', marginBottom: '24px' }}>How HabitGarden Works</h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>📝</div>
            <h3 style={{ marginBottom: '8px' }}>1. Create a Habit</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              Set up daily habits like reading 20 pages, drinking water, exercising, or studying JavaScript.
            </p>
          </div>

          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>☑️</div>
            <h3 style={{ marginBottom: '8px' }}>2. Complete It Daily</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              Check off your habit each day to earn +10 points and build your daily streak.
            </p>
          </div>

          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🌸</div>
            <h3 style={{ marginBottom: '8px' }}>3. Grow Your Garden</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              Accumulate points to level up your virtual garden from a small seed into a blooming paradise.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
