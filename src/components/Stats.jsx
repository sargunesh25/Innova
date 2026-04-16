import React, { useEffect, useState } from 'react';
import { api } from '../lib/api';
import './Stats.css';

const Stats = () => {
  const [statsData, setStatsData] = useState([
    { value: '₹0', label: 'AWARDED' },
    { value: '0', label: 'MEMBERS' },
    { value: '0', label: 'SOLUTIONS' },
    { value: '0', label: 'CHALLENGES' },
  ]);

  useEffect(() => {
    api.get('/api/stats/platform')
      .then((stats) => {
        setStatsData([
          { value: `₹${Number(stats?.distributed_amount || stats?.distributed || 0).toLocaleString('en-IN')}`, label: 'AWARDED' },
          { value: Number(stats?.contributors_count || stats?.members || 0).toLocaleString('en-IN'), label: 'MEMBERS' },
          { value: Number(stats?.challenges_solved || stats?.solutions || 0).toLocaleString('en-IN'), label: 'SOLUTIONS' },
          { value: Number(stats?.active_challenges || stats?.challenges || 0).toLocaleString('en-IN'), label: 'CHALLENGES' },
        ]);
      })
      .catch(() => {});
  }, []);

  return (
    <section className="stats container">
      <div className="stats-grid">
        {statsData.map((stat, index) => (
          <div key={index} className="stat-item">
            <h2 className="stat-value">{stat.value}</h2>
            <p className="stat-label">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Stats;
