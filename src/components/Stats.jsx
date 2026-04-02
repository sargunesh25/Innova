import React from 'react';
import './Stats.css';

const Stats = () => {
  const statsData = [
    { value: '₹2.4M', label: 'AWARDED' },
    { value: '18.4K', label: 'MEMBERS' },
    { value: '450+', label: 'SOLUTIONS' },
    { value: '12', label: 'INDUSTRIES' }
  ];

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
