import React from 'react';
import { ArrowUpRight, CheckCircle2, MoreHorizontal } from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
  return (
    <div className="dashboard-container container">
      {/* Welcome Banner */}
      <div className="welcome-banner">
        <div className="welcome-text">
          <h1>Good morning, Arjun</h1>
          <p>You're in the top <em>5% of researchers</em> this month. Here's your impact overview for today.</p>
        </div>
        <div className="welcome-stats">
          <div className="banner-stat-box">
            <span>CURRENT STREAK</span>
            <strong>12 Days</strong>
          </div>
          <div className="banner-stat-box">
            <span>OPEN CHALLENGES</span>
            <strong>24</strong>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="metrics-row">
        <div className="metric-card">
          <div className="metric-header">TOTAL SUBMISSIONS</div>
          <div className="metric-body">
            <span className="metric-value">14</span>
            <div className="metric-indicator">
              <span className="metric-badge">+2 WK</span>
            </div>
          </div>
        </div>
        <div className="metric-card">
          <div className="metric-header">IDEAS UPVOTED</div>
          <div className="metric-body">
            <span className="metric-value">128</span>
            <div className="metric-indicator text-secondary">
              <ArrowUpRight size={20} />
            </div>
          </div>
        </div>
        <div className="metric-card">
          <div className="metric-header">PRIZE EARNINGS</div>
          <div className="metric-body">
            <span className="metric-value">₹4,250.00</span>
          </div>
        </div>
        <div className="metric-card">
          <div className="metric-header">REPUTATION SCORE</div>
          <div className="metric-body">
            <span className="metric-value">892</span>
            <div className="metric-indicator text-verified">
              <CheckCircle2 size={20} color="#1a1a1a" fill="#fff" />
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Layout */}
      <div className="dashboard-layout">
        {/* Left Column */}
        <div className="dashboard-left">

          {/* Active Challenges */}
          <section className="dashboard-section card-box">
            <div className="section-header-row">
              <h2>Active Challenges</h2>
              <a href="/challenges" className="header-link">BROWSE DIRECTORY</a>
            </div>

            <div className="active-challenge-item">
              <div className="ac-header">
                <div>
                  <h3>Sustainable Urban Mobility Phase II</h3>
                  <p>Smart Infrastructure Department</p>
                </div>
                <div className="ac-tag">2 DAYS LEFT</div>
              </div>
              <div className="ac-progress">
                <div className="progress-bar-bg"><div className="progress-bar-fill" style={{ width: '75%' }}></div><div className="progress-dot" style={{ left: '75%' }}></div></div>
              </div>
              <div className="ac-footer">
                <span>RESEARCH PHASE</span>
                <span>75% COMPLETE</span>
              </div>
            </div>

            <div className="active-challenge-item last">
              <div className="ac-header">
                <div>
                  <h3>AI Ethics Framework for Public Health</h3>
                  <p>Global Ethics Laboratory</p>
                </div>
                <div className="ac-tag">14 DAYS LEFT</div>
              </div>
              <div className="ac-progress">
                <div className="progress-bar-bg"><div className="progress-bar-fill" style={{ width: '32%' }}></div><div className="progress-dot" style={{ left: '32%' }}></div></div>
              </div>
              <div className="ac-footer">
                <span>IDEATION PHASE</span>
                <span>32% COMPLETE</span>
              </div>
            </div>
          </section>

          {/* Featured Opportunities */}
          <section className="dashboard-section">
            <h2 className="section-title">Featured Opportunities</h2>

            <div className="featured-card large-featured">
              <div className="featured-image" style={{ backgroundImage: `url(/quantum.png)` }}></div>
              <div className="featured-content">
                <span className="feat-pill dark">HIGH STAKES</span>
                <h3>Quantum Encryption<br />Protocols for 2030</h3>
                <p>Propose a hardware-level encryption standard for the next generation of secure communication. Submissions require technical whitepapers.</p>
                <div className="feat-footer">
                  <span className="feat-price">₹15,000</span>
                  <button className="primary-btn apply-btn">Apply Now</button>
                </div>
              </div>
            </div>

            <div className="featured-card-row">
              <div className="featured-subcard">
                <div className="subcard-image" style={{ backgroundImage: `url(/forest.png)` }}></div>
                <div className="subcard-content">
                  <span className="feat-pill light">ECO FOCUS</span>
                  <h4>Carbon Capture in Arid Climates</h4>
                  <div className="subcard-footer">
                    <span className="feat-price-small">₹8,200</span>
                    <span className="feat-stat">125 RESEARCHERS</span>
                  </div>
                </div>
              </div>

              <div className="featured-subcard solid-bg">
                <div className="subcard-text-hero">
                  <em>New Research: The Future<br />of Biotech</em>
                </div>
                <div className="subcard-content">
                  <span className="feat-pill light">LABORATORY</span>
                  <h4>Synthetic Protein Synthesis</h4>
                  <div className="subcard-footer">
                    <span className="feat-price-small">₹12,400</span>
                    <span className="feat-stat">45 RESEARCHERS</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

        </div>

        {/* Right Column */}
        <div className="dashboard-right">

          {/* Journal Log */}
          <div className="dashboard-widget card-box">
            <h2 className="widget-title">Journal Log</h2>
            <ul className="journal-timeline">
              <li>
                <div className="timeline-dot"></div>
                <div className="timeline-content">
                  <p><strong>Elena Vance</strong> upvoted your idea in <em>Urban<br />Mobility</em>.</p>
                  <span className="timeline-time">2 HOURS AGO</span>
                </div>
              </li>
              <li>
                <div className="timeline-empty"></div>
                <div className="timeline-content">
                  <p>Your submission reached the <strong>Semi-Finals</strong><br />round in Ethics.</p>
                  <span className="timeline-time">5 HOURS AGO</span>
                </div>
              </li>
              <li>
                <div className="timeline-empty"></div>
                <div className="timeline-content">
                  <p><strong>Dr. Aris</strong> left a detailed note on your paper.</p>
                  <span className="timeline-time">YESTERDAY</span>
                </div>
              </li>
            </ul>
          </div>

          {/* Fellowship Rankings */}
          <div className="dashboard-widget card-box">
            <h2 className="widget-title">Fellowship Rankings</h2>
            <div className="ranking-list">
              <div className="ranking-item">
                <span className="rank-num">1</span>
                <img src="https://ui-avatars.com/api/?name=Sarah&background=random" alt="Sarah" className="rank-avatar" />
                <div className="rank-info">
                  <strong>Sarah Jenkins</strong>
                  <span>1,240 XP</span>
                </div>
                <ArrowUpRight size={16} className="rank-icon trend-up" />
              </div>

              <div className="ranking-item">
                <span className="rank-num">2</span>
                <img src="https://ui-avatars.com/api/?name=Marcus&background=random" alt="Marcus" className="rank-avatar" />
                <div className="rank-info">
                  <strong>Marcus Chen</strong>
                  <span>1,150 XP</span>
                </div>
                <MoreHorizontal size={16} className="rank-icon trend-flat" />
              </div>

              <div className="ranking-item highlight-card">
                <span className="rank-num">12</span>
                <div className="rank-info">
                  <strong>Arjun (You)</strong>
                  <span>892 XP</span>
                </div>
                <span className="rank-badge">TOP 5%</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
