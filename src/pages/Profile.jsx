import React, { useState } from 'react';
import { Pencil, Award, Search, DollarSign, Users, Rocket, GraduationCap, Lock, Loader2 } from 'lucide-react';
import { useDashboardInfo } from '../context/DashboardContext';
import './Profile.css';

const iconMap = { Award, Search, DollarSign, Users, Rocket, GraduationCap, Lock };

const Profile = () => {
  const { profileData, isLoading } = useDashboardInfo();
  const [activeFilter, setActiveFilter] = useState('All');

  if (isLoading || !profileData) {
    return (
      <div className="profile-container container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <Loader2 size={48} color="var(--brand-green)" style={{ animation: 'spin 2s linear infinite', marginBottom: '1rem' }} />
        <p style={{ color: 'var(--text-secondary)', fontWeight: 600, letterSpacing: '1px' }}>LOADING PROFILE...</p>
        <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const filteredHistory = activeFilter === 'All'
    ? profileData.submissionHistory
    : profileData.submissionHistory.filter(s => {
        if (activeFilter === 'Won') return s.status === 'WON';
        if (activeFilter === 'Drafts') return s.status === 'DRAFT';
        return true;
      });

  return (
    <div className="profile-container container">
      
      {/* Dark Banner */}
      <div className="profile-banner">
        <div className="banner-left">
          <div className="avatar-wrapper">
            <img src={profileData.avatarUrl} alt={profileData.name} className="profile-avatar" />
          </div>
          <div className="profile-info">
            <h1>{profileData.name}</h1>
            <p className="profile-title">{profileData.title} &middot; {profileData.location}</p>
            <div className="profile-badges">
              {profileData.badges.map((badge, i) => (
                <span key={i} className={`badge-pill ${badge.type}`}>{badge.label}</span>
              ))}
            </div>
          </div>
        </div>
        <div className="banner-right">
          <button className="edit-profile-btn">
            <Pencil size={14} /> Edit profile
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="profile-stats-row">
        <div className="profile-stat-card">
          <span className="p-stat-label">SUBMISSIONS</span>
          <strong className="p-stat-value">{profileData.stats.submissions}</strong>
        </div>
        <div className="profile-stat-card">
          <span className="p-stat-label">WINS</span>
          <strong className="p-stat-value">{profileData.stats.wins}</strong>
        </div>
        <div className="profile-stat-card">
          <span className="p-stat-label">REPUTATION PTS</span>
          <strong className="p-stat-value">{profileData.stats.reputationPts}</strong>
        </div>
        <div className="profile-stat-card">
          <span className="p-stat-label">TOTAL EARNED</span>
          <strong className="p-stat-value">{profileData.stats.totalEarned}</strong>
        </div>
      </div>

      {/* 2-Column Layout */}
      <div className="profile-layout">
        
        {/* Left Column: Submission History */}
        <div className="profile-left">
          <div className="history-header">
            <h2>Submission History</h2>
            <div className="history-filters">
              {['All', 'Won', 'Drafts'].map(f => (
                <button key={f} className={`filter-tab ${activeFilter === f ? 'active' : ''}`} onClick={() => setActiveFilter(f)}>{f}</button>
              ))}
            </div>
          </div>

          <div className="history-list">
            {filteredHistory.map(item => (
              <div key={item.id} className="history-card">
                <div className="hc-left">
                  <div className="hc-icon-box">
                    <span className="icon-symbol">{item.icon}</span>
                  </div>
                  <div className="hc-info">
                    <h3>{item.title}</h3>
                    <span className="hc-date">{item.date}</span>
                  </div>
                </div>
                <div className="hc-right">
                  <span className={`hc-status ${item.statusClass}`}>{item.status}</span>
                  <span className="hc-prize">{item.prize}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Metadata Sidebar */}
        <div className="profile-right">
          
          <div className="sidebar-section">
            <h4 className="sidebar-title">REPUTATION BREAKDOWN</h4>
            {profileData.reputationBreakdown.map((rep, i) => (
              <div key={i} className="rep-bar-group">
                <div className="rep-bar-header">
                  <span>{rep.label}</span>
                  <span>{rep.percent}%</span>
                </div>
                <div className="rep-bar-bg">
                  <div className="rep-bar-fill" style={{width: `${rep.percent}%`}}></div>
                </div>
              </div>
            ))}
          </div>

          <div className="sidebar-section">
            <h4 className="sidebar-title">DOMAIN EXPERTISE</h4>
            <div className="expertise-tags">
              {profileData.expertise.map((tag, i) => (
                <span key={i} className="expertise-tag">{tag}</span>
              ))}
            </div>
          </div>

          <div className="sidebar-section">
            <h4 className="sidebar-title">UNLOCKED ACHIEVEMENTS</h4>
            <div className="achievements-grid">
              {profileData.achievements.map((ach, i) => {
                const IconComponent = iconMap[ach.icon];
                return (
                  <div key={i} className={`ach-box ${ach.unlocked ? 'unlocked' : 'locked'}`}>
                    <IconComponent size={20} color={ach.unlocked ? '#1a6d36' : '#ccc'} />
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Profile;
