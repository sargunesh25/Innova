import React, { useState, useMemo } from 'react';
import { Clock, Beaker, CheckCircle2, ChevronRight, FileText, Loader2 } from 'lucide-react';
import { useDashboardInfo } from '../context/DashboardContext';
import './Laboratory.css';

const Laboratory = () => {
  const { labSubmissions, isLoading } = useDashboardInfo();
  const [activeTab, setActiveTab] = useState('All Active');

  const tabs = ['All Active', 'Drafts', 'Submitted', 'Completed'];

  const filteredSubmissions = useMemo(() => {
    if (activeTab === 'All Active') return labSubmissions;
    if (activeTab === 'Drafts') return labSubmissions.filter(s => s.status === 'Drafting');
    if (activeTab === 'Submitted') return labSubmissions.filter(s => s.status === 'Submitted');
    if (activeTab === 'Completed') return labSubmissions.filter(s => s.status === 'Under Evaluation' || s.progress === 100);
    return labSubmissions;
  }, [labSubmissions, activeTab]);

  if (isLoading) {
    return (
      <div className="laboratory-page container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <Loader2 size={48} color="var(--brand-green)" style={{ animation: 'spin 2s linear infinite', marginBottom: '1rem' }} />
        <p style={{ color: 'var(--text-secondary)', fontWeight: 600, letterSpacing: '1px' }}>LOADING LABORATORY...</p>
        <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div className="laboratory-page container">
      <div className="lab-header">
        <h1 className="page-title">My Laboratory</h1>
        <p className="page-subtitle">Your private workspace for active challenges and ongoing submissions.</p>
      </div>

      <div className="lab-workspace">
        <div className="workspace-tabs">
          {tabs.map(tab => (
            <button 
              key={tab} 
              className={`workspace-tab ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="submissions-list">
          {filteredSubmissions.length > 0 ? filteredSubmissions.map(sub => (
            <div key={sub.id} className="submission-track-card">
              <div className="track-left">
                <div className="track-icon-wrapper">
                  {sub.status === 'Drafting' ? <FileText size={24} color="#dfa838" /> :
                   sub.status === 'Submitted' ? <CheckCircle2 size={24} color="#1a6d36" /> :
                   <Beaker size={24} color="#6a40bf" />}
                </div>
                <div className="track-info">
                  <span className="track-category">{sub.category}</span>
                  <h3 className="track-title">{sub.title}</h3>
                  <div className="track-meta">
                    <span className="meta-item"><Clock size={14} /> {sub.lastEdited}</span>
                    <span className="meta-item">•</span>
                    <span className="meta-item milestone-text">Next: {sub.milestone}</span>
                  </div>
                </div>
              </div>

              <div className="track-right">
                <div className="status-indicator">
                  <div className="status-text-row">
                    <span className="status-label">{sub.status}</span>
                    <span className="status-deadline">{sub.deadline}</span>
                  </div>
                  <div className="status-bar-bg">
                    <div 
                      className="status-bar-fill" 
                      style={{ 
                        width: `${sub.progress}%`,
                        backgroundColor: sub.status === 'Drafting' ? '#dfa838' : '#1a6d36'
                      }}
                    ></div>
                  </div>
                </div>
                <button className="continue-btn icon-btn">
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          )) : (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
              <p>No submissions found for this filter.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Laboratory;
