import React, { useState, useEffect } from 'react';
import { apiCall } from '../services/api';

const AchievementsPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const result = await apiCall('/achievements');
        setData(result);
      } catch (err) {
        console.error('Error fetching achievements:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAchievements();
  }, []);

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px 0' }}>Loading achievements... 🏆</div>;
  }

  const { totalUnlocked, totalCount, achievements } = data || {};

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
        <div>
          <h1 className="page-title">Achievements 🏆</h1>
          <p className="page-subtitle">Unlock milestones as you build daily habits and streaks.</p>
        </div>
        <div style={{ backgroundColor: 'var(--light-green)', color: 'var(--primary-green)', padding: '6px 14px', borderRadius: '20px', fontWeight: 700, fontSize: '0.9rem' }}>
          Unlocked: {totalUnlocked} / {totalCount}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
        {achievements && achievements.map((a) => (
          <div
            key={a.id}
            className="card"
            style={{
              backgroundColor: a.unlocked ? '#ffffff' : '#f9fafb',
              border: a.unlocked ? '1px solid var(--accent-green)' : '1px dashed var(--border-color)',
              opacity: a.unlocked ? 1 : 0.7
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '12px' }}>
              <span style={{ fontSize: '2.4rem', filter: a.unlocked ? 'none' : 'grayscale(100%)' }}>
                {a.icon}
              </span>
              <div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '2px' }}>{a.title}</h3>
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: a.unlocked ? 'var(--primary-green)' : 'var(--text-muted)',
                    backgroundColor: a.unlocked ? 'var(--light-green)' : '#edf2f7',
                    padding: '2px 8px',
                    borderRadius: '4px'
                  }}
                >
                  {a.unlocked ? '✓ Unlocked' : '🔒 Locked'}
                </span>
              </div>
            </div>

            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
              {a.description}
            </p>

            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              {a.progressText}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AchievementsPage;
