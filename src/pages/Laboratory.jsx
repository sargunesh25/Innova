import React, { useState } from 'react';
import { Clock, Beaker, CheckCircle2, ChevronRight, FileText } from 'lucide-react';
import './Laboratory.css';

const activeSubmissions = [
  {
    id: 1,
    title: "Quantum-Safe Encryption Protocols",
    category: "ENGINEERING",
    status: "Drafting",
    progress: 30,
    deadline: "12 Days Left",
    lastEdited: "2 hours ago",
    milestone: "Write Abstract"
  },
  {
    id: 2,
    title: "Sustainable Micro-Grid Economic Models",
    category: "RESEARCH",
    status: "Submitted",
    progress: 100,
    deadline: "Evaluation Phase",
    lastEdited: "3 days ago",
    milestone: "Awaiting Results"
  },
  {
    id: 3,
    title: "Adaptive Accessibility for VR Interfaces",
    category: "DESIGN",
    status: "Under Evaluation",
    progress: 100,
    deadline: "Judging",
    lastEdited: "1 week ago",
    milestone: "Semi-Finalist"
  }
];

const Laboratory = () => {
  const [activeTab, setActiveTab] = useState('All Active');

  const tabs = ['All Active', 'Drafts', 'Submitted', 'Completed'];

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
          {activeSubmissions.map(sub => (
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
          ))}
        </div>
      </div>
    </div>
  );
};

export default Laboratory;
