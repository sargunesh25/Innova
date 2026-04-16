import React, { useEffect } from 'react';
import { ArrowUpRight, CheckCircle2, MoreHorizontal, Loader2, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDashboardInfo } from '../context/DashboardContext';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const {
    isLoading, error,
    userProfile, solverMetrics, activeChallenges,
    opportunities, journalLogs, rankings,
    applyToOpportunity, fetchSolverDashboard
  } = useDashboardInfo();

  const mainOpportunities = opportunities.filter(o => o.displayType === 'featured_main');
  const secondaryOpportunities = opportunities.filter(o => o.displayType !== 'featured_main');
  const greetingName = userProfile?.firstName || userProfile?.name?.split(' ')[0] || 'Researcher';

  useEffect(() => {
    fetchSolverDashboard();
  }, [fetchSolverDashboard]);

  if (isLoading || !solverMetrics || !userProfile) {
    return (
      <div className="dashboard-container container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <Loader2 size={48} color="var(--brand-green)" style={{ animation: 'spin 2s linear infinite', marginBottom: '1rem' }} />
        <p style={{ color: 'var(--text-secondary)', fontWeight: 600, letterSpacing: '1px' }}>SYNCING SECURE DATA...</p>
        <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container container" style={{ textAlign: 'center', padding: '4rem' }}>
        <h2 style={{ color: '#d9534f' }}>Connection Error</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container container">
      {/* Welcome Banner */}
      <div className="welcome-banner">
        <div className="welcome-text">
          <h1>Good morning, {greetingName}</h1>
          <p>You're in the top <em>{userProfile.percentile}% of researchers</em> this month. Here's your impact overview for today.</p>
        </div>
        <div className="welcome-stats">
          <div className="banner-stat-box">
            <span>CURRENT STREAK</span>
            <strong>{solverMetrics.streak} Days</strong>
          </div>
          <div className="banner-stat-box">
            <span>OPEN CHALLENGES</span>
            <strong>{solverMetrics.openChallenges}</strong>
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

            {activeChallenges.map((challenge, index) => (
              <div key={challenge.id} className={`active-challenge-item ${index === activeChallenges.length - 1 ? 'last' : ''}`}>
                <div className="ac-header">
                  <div>
                    <h3>{challenge.title}</h3>
                    <p>{challenge.dept}</p>
                  </div>
                  <div className="ac-tag">{challenge.daysLeft} DAYS LEFT</div>
                </div>
                <div className="ac-footer">
                  <span>{challenge.phase}</span>
                  <button
                    className="ac-view-btn"
                    onClick={() => navigate(`/challenge/${challenge.id}`)}
                    aria-label="View challenge"
                  >
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </section>

          {/* Featured Opportunities */}
          <section className="dashboard-section">
            <h2 className="section-title">Featured Opportunities</h2>

            {mainOpportunities.map(opp => (
              <div key={opp.id} className="featured-card large-featured">
                <div className="featured-image" style={{ backgroundImage: `url(${opp.image})` }}></div>
                <div className="featured-content">
                  <span className="feat-pill dark">{opp.tag}</span>
                  <h3>{opp.title}</h3>
                  <p>{opp.description}</p>
                  <div className="feat-footer">
                    <span className="feat-price">{opp.prize}</span>
                    <button className="primary-btn apply-btn" onClick={() => applyToOpportunity(opp.id)}>Apply Now</button>
                  </div>
                </div>
              </div>
            ))}

            <div className="featured-card-row">
              {secondaryOpportunities.map(opp => (
                <div key={opp.id} className={`featured-subcard ${opp.isHero ? 'solid-bg' : ''}`}>
                  {opp.isHero ? (
                    <div className="subcard-text-hero" dangerouslySetInnerHTML={{ __html: `<em>${opp.heroText}</em>` }}>
                    </div>
                  ) : (
                    <div className="subcard-image" style={{ backgroundImage: `url(${opp.image})` }}></div>
                  )}
                  <div className="subcard-content">
                    <span className="feat-pill light">{opp.tag}</span>
                    <h4>{opp.title}</h4>
                    <div className="subcard-footer">
                      <span className="feat-price-small">{opp.prize}</span>
                      <span className="feat-stat">{opp.stats}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

        </div>

        {/* Right Column */}
        <div className="dashboard-right">

          {/* Journal Log */}
          <div className="dashboard-widget card-box">
            <h2 className="widget-title">Journal Log</h2>
            <ul className="journal-timeline">
              {journalLogs.map(log => (
                <li key={log.id}>
                  <div className={log.hasDot ? "timeline-dot" : "timeline-empty"}></div>
                  <div className="timeline-content">
                    <p dangerouslySetInnerHTML={{ __html: log.text }}></p>
                    <span className="timeline-time">{log.time}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Fellowship Rankings */}
          <div className="dashboard-widget card-box">
            <h2 className="widget-title">Fellowship Rankings</h2>
            <div className="ranking-list">
              {rankings.map(rank => (
                <div key={rank.id} className={`ranking-item ${rank.trend === 'highlight' ? 'highlight-card' : ''}`}>
                  <span className="rank-num">{rank.rank}</span>
                  {rank.trend !== 'highlight' && (
                    <img src={`https://ui-avatars.com/api/?name=${rank.name.split(' ')[0]}&background=random`} alt={rank.name} className="rank-avatar" />
                  )}
                  <div className="rank-info">
                    <strong>{rank.name}</strong>
                    <span>{rank.xp}</span>
                  </div>
                  {rank.trend === 'up' && <ArrowUpRight size={16} className="rank-icon trend-up" />}
                  {rank.trend === 'flat' && <MoreHorizontal size={16} className="rank-icon trend-flat" />}
                  {rank.badge && <span className="rank-badge">{rank.badge}</span>}
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
