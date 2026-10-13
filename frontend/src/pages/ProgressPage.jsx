import React, { useState, useEffect } from 'react';
import { apiCall } from '../services/api';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ProgressPage = () => {
  const [progressData, setProgressData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const data = await apiCall('/progress');
        setProgressData(data);
      } catch (err) {
        console.error('Error fetching progress:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, []);

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px 0' }}>Loading progress statistics... 📊</div>;
  }

  const { stats, weeklyChartData, recentHistory } = progressData || {};

  const chartData = {
    labels: weeklyChartData ? weeklyChartData.map(d => d.day) : [],
    datasets: [
      {
        label: 'Habits Completed',
        data: weeklyChartData ? weeklyChartData.map(d => d.completedCount) : [],
        backgroundColor: '#40916c',
        borderRadius: 6
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: 'Habits Completed in the Past 7 Days',
        font: { size: 14, weight: '600' },
        color: '#2d3748'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1
        }
      }
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Progress & Statistics 📈</h1>
        <p className="page-subtitle">Track your long-term consistency, daily activity, and streak records.</p>
      </div>

      {/* Summary Metrics */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">✔️</div>
          <div>
            <div className="stat-value">{stats?.totalCompleted || 0}</div>
            <div className="stat-label">Total Habits Completed</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📅</div>
          <div>
            <div className="stat-value">{stats?.monthlyCompleted || 0}</div>
            <div className="stat-label">Completed This Month</div>
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
          <div className="stat-icon">🏆</div>
          <div>
            <div className="stat-value">{stats?.longestStreak || 0} Days</div>
            <div className="stat-label">Longest Streak</div>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="card" style={{ marginBottom: '24px', padding: '24px' }}>
        <div style={{ height: '260px' }}>
          <Bar data={chartData} options={chartOptions} />
        </div>
      </div>

      {/* Recent Completion History */}
      <div className="card">
        <h3 style={{ marginBottom: '16px' }}>Recent Completion History</h3>

        {recentHistory && recentHistory.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                  <th style={{ padding: '8px 12px' }}>Habit</th>
                  <th style={{ padding: '8px 12px' }}>Date</th>
                  <th style={{ padding: '8px 12px' }}>Points Earned</th>
                  <th style={{ padding: '8px 12px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentHistory.map((rec) => (
                  <tr key={rec._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '10px 12px', fontWeight: 600 }}>{rec.habitId?.name || 'Deleted Habit'}</td>
                    <td style={{ padding: '10px 12px', color: 'var(--text-secondary)' }}>{rec.date}</td>
                    <td style={{ padding: '10px 12px', color: 'var(--primary-green)', fontWeight: 600 }}>+10 pts</td>
                    <td style={{ padding: '10px 12px' }}>
                      <span style={{ backgroundColor: 'var(--light-green)', color: 'var(--primary-green)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600 }}>
                        Completed
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '20px' }}>
            No habit completions logged yet.
          </p>
        )}
      </div>
    </div>
  );
};

export default ProgressPage;
