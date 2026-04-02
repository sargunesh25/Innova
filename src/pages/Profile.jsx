import React from 'react';
import { Pencil, Award, Search, DollarSign, Users, Rocket, GraduationCap, Lock } from 'lucide-react';
import './Profile.css';
import avatarImg from '/julian_avatar.png'; // Placeholder for the copied image

const Profile = () => {
  return (
    <div className="profile-container container">
      
      {/* Dark Banner */}
      <div className="profile-banner">
        <div className="banner-left">
          <div className="avatar-wrapper">
            <img src={'/julian_avatar.png'} alt="Julian Deering" className="profile-avatar" />
          </div>
          <div className="profile-info">
            <h1>Julian Deering</h1>
            <p className="profile-title">Lead Architect &middot; London, UK</p>
            <div className="profile-badges">
              <span className="badge-pill elite">ELITE CONTRIBUTOR</span>
              <span className="badge-pill mentor">TOP 1% MENTOR</span>
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
          <strong className="p-stat-value">124</strong>
        </div>
        <div className="profile-stat-card">
          <span className="p-stat-label">WINS</span>
          <strong className="p-stat-value">18</strong>
        </div>
        <div className="profile-stat-card">
          <span className="p-stat-label">REPUTATION PTS</span>
          <strong className="p-stat-value">8,420</strong>
        </div>
        <div className="profile-stat-card">
          <span className="p-stat-label">TOTAL EARNED</span>
          <strong className="p-stat-value">₹42.5k</strong>
        </div>
      </div>

      {/* 2-Column Layout */}
      <div className="profile-layout">
        
        {/* Left Column: Submission History */}
        <div className="profile-left">
          <div className="history-header">
            <h2>Submission History</h2>
            <div className="history-filters">
              <button className="filter-tab active">All</button>
              <button className="filter-tab">Won</button>
              <button className="filter-tab">Drafts</button>
            </div>
          </div>

          <div className="history-list">
            
            <div className="history-card">
              <div className="hc-left">
                <div className="hc-icon-box">
                  <span className="icon-symbol">&#9732;</span> {/* Fallback icon, wait Mockup has specific icons */}
                </div>
                <div className="hc-info">
                  <h3>Quantum Computing Architecture for Logistics</h3>
                  <span className="hc-date">Submitted Mar 12, 2024</span>
                </div>
              </div>
              <div className="hc-right">
                <span className="hc-status status-won">WON</span>
                <span className="hc-prize">₹12,000</span>
              </div>
            </div>

            <div className="history-card">
              <div className="hc-left">
                <div className="hc-icon-box">
                  <span className="icon-symbol">&#127807;</span>
                </div>
                <div className="hc-info">
                  <h3>Sustainable Water Purification in Arid Regions</h3>
                  <span className="hc-date">Submitted Feb 28, 2024</span>
                </div>
              </div>
              <div className="hc-right">
                <span className="hc-status status-review">UNDER REVIEW</span>
                <span className="hc-prize">₹8,500</span>
              </div>
            </div>

            <div className="history-card">
              <div className="hc-left">
                <div className="hc-icon-box">
                  <span className="icon-symbol">&#9881;</span>
                </div>
                <div className="hc-info">
                  <h3>Neural Interface for Edge Processing</h3>
                  <span className="hc-date">Submitted Jan 15, 2024</span>
                </div>
              </div>
              <div className="hc-right">
                <span className="hc-status status-finalist">FINALIST</span>
                <span className="hc-prize">₹22,000</span>
              </div>
            </div>

          </div>
        </div>

        {/* Right Column: Metadata Sidebar */}
        <div className="profile-right">
          
          <div className="sidebar-section">
            <h4 className="sidebar-title">REPUTATION BREAKDOWN</h4>
            
            <div className="rep-bar-group">
              <div className="rep-bar-header">
                <span>Innovation Design</span>
                <span>85%</span>
              </div>
              <div className="rep-bar-bg">
                <div className="rep-bar-fill" style={{width: '85%'}}></div>
              </div>
            </div>

            <div className="rep-bar-group">
              <div className="rep-bar-header">
                <span>Technical Rigor</span>
                <span>92%</span>
              </div>
              <div className="rep-bar-bg">
                <div className="rep-bar-fill" style={{width: '92%'}}></div>
              </div>
            </div>

            <div className="rep-bar-group">
              <div className="rep-bar-header">
                <span>Peer Mentorship</span>
                <span>64%</span>
              </div>
              <div className="rep-bar-bg">
                <div className="rep-bar-fill" style={{width: '64%'}}></div>
              </div>
            </div>
          </div>

          <div className="sidebar-section">
            <h4 className="sidebar-title">DOMAIN EXPERTISE</h4>
            <div className="expertise-tags">
              <span className="expertise-tag">Systems Architecture</span>
              <span className="expertise-tag">Biotech</span>
              <span className="expertise-tag">AI Ethics</span>
              <span className="expertise-tag">Urban Planning</span>
              <span className="expertise-tag">Product Strategy</span>
            </div>
          </div>

          <div className="sidebar-section">
            <h4 className="sidebar-title">UNLOCKED ACHIEVEMENTS</h4>
            <div className="achievements-grid">
              <div className="ach-box unlocked"><Award size={20} color="#1a6d36" /></div>
              <div className="ach-box unlocked"><Search size={20} color="#1a6d36" /></div>
              <div className="ach-box unlocked"><DollarSign size={20} color="#1a6d36" /></div>
              <div className="ach-box unlocked"><Users size={20} color="#1a6d36" /></div>
              <div className="ach-box unlocked"><Rocket size={20} color="#1a6d36" /></div>
              <div className="ach-box unlocked"><GraduationCap size={20} color="#1a6d36" /></div>
              <div className="ach-box locked"><Lock size={20} color="#ccc" /></div>
              <div className="ach-box locked"><Lock size={20} color="#ccc" /></div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Profile;
