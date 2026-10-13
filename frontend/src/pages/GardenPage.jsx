import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import GardenDisplay from '../components/GardenDisplay';

const GardenPage = () => {
  const { user } = useContext(AuthContext);

  const stagesInfo = [
    { level: 1, name: 'Seed', icon: '🌱', points: '0 - 49 pts', desc: 'Starting point of your journey.' },
    { level: 2, name: 'Small Plant', icon: '🌿', points: '50 - 149 pts', desc: 'Leaves sprout as consistency grows.' },
    { level: 3, name: 'Growing Plant', icon: '🌳', points: '150 - 299 pts', desc: 'A sturdy trunk forming deep roots.' },
    { level: 4, name: 'Mature Garden', icon: '🌸', points: '300+ pts', desc: 'Full bloom garden celebrating long-term effort.' }
  ];

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">My Garden 🌸</h1>
        <p className="page-subtitle">Your virtual garden grows as you complete habits daily (+10 pts per completed habit).</p>
      </div>

      <GardenDisplay points={user?.points || 0} />

      <div style={{ marginTop: '30px' }}>
        <h3 style={{ marginBottom: '16px' }}>Garden Stages & Milestones</h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
          {stagesInfo.map((s) => {
            let isCurrent = false;
            let isUnlocked = false;

            const p = user?.points || 0;
            if (s.level === 1 && p < 50) isCurrent = true;
            if (s.level === 2 && p >= 50 && p < 150) isCurrent = true;
            if (s.level === 3 && p >= 150 && p < 300) isCurrent = true;
            if (s.level === 4 && p >= 300) isCurrent = true;

            if (s.level === 1 && p >= 0) isUnlocked = true;
            if (s.level === 2 && p >= 50) isUnlocked = true;
            if (s.level === 3 && p >= 150) isUnlocked = true;
            if (s.level === 4 && p >= 300) isUnlocked = true;

            return (
              <div
                key={s.level}
                className="card"
                style={{
                  border: isCurrent ? '2px solid var(--primary-green)' : '1px solid var(--border-color)',
                  backgroundColor: isCurrent ? '#f0fdf4' : isUnlocked ? '#ffffff' : '#fafafa',
                  opacity: isUnlocked ? 1 : 0.65
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '2rem' }}>{s.icon}</span>
                  {isCurrent && (
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary-green)', backgroundColor: 'var(--light-green)', padding: '2px 8px', borderRadius: '10px' }}>
                      Current Stage
                    </span>
                  )}
                </div>
                <h4 style={{ marginBottom: '4px' }}>Level {s.level}: {s.name}</h4>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--amber-accent)', marginBottom: '8px' }}>
                  {s.points}
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{s.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default GardenPage;
