import React from 'react';
import { Plus, ArrowRight, BookOpen, Loader2 } from 'lucide-react';
import { useDashboardInfo } from '../context/DashboardContext';
import './CompanyDashboard.css';

const CompanyDashboard = () => {
  const { isLoading, error, companyProfile, companyMetrics, operationalLedger } = useDashboardInfo();

  if (isLoading || !companyProfile || !companyMetrics) {
    return (
      <div className="company-dashboard" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <Loader2 size={48} color="#1a6d36" style={{ animation: 'spin 2s linear infinite', marginBottom: '1rem' }} />
        <p style={{ color: 'var(--text-secondary)', fontWeight: 600, letterSpacing: '1px' }}>INITIALIZING ENTERPRISE DASHBOARD...</p>
        <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div className="company-dashboard" style={{ textAlign: 'center', padding: '4rem' }}>
        <h2 style={{ color: '#d9534f' }}>Connection Error</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="company-dashboard">
      
      {/* Header Plate */}
      <div className="cd-header container">
        <div className="cd-header-left">
          <div className="company-logo-block">
             <div className="cd-logo-standin">
                <div className="cd-logo-leaf">&#127807;</div>
                <span>{companyProfile.logoText}</span>
             </div>
          </div>
          <div className="company-title-info">
            <h1>{companyProfile.name} <span className="cd-section-badge">SECTION 02</span></h1>
            <p>ENTERPRISE INNOVATION DASHBOARD & ARCHIVE</p>
          </div>
        </div>
        <div className="cd-header-right">
          <button className="primary-btn dark-green-btn">
            <Plus size={16} style={{marginRight: '8px'}}/> POST A NEW CHALLENGE
          </button>
        </div>
      </div>

      <div className="cd-main-content container">
        {/* Top Metrics Grid */}
        <div className="cd-metrics-grid">
          <div className="cd-metric-card light-card">
            <span className="cd-metric-label">REGISTERED USERS</span>
            <div className="cd-metric-data">
              <span className="cd-metric-number">{companyMetrics.registeredUsers.count} <small>{companyMetrics.registeredUsers.trend}</small></span>
              <div className="cd-metric-chart-bars">
                 <div className="cd-bar b1"></div>
                 <div className="cd-bar b2"></div>
                 <div className="cd-bar b3"></div>
                 <div className="cd-bar b4"></div>
                 <div className="cd-bar b5"></div>
                 <div className="cd-bar b6"></div>
              </div>
            </div>
          </div>

          <div className="cd-metric-card light-card">
            <span className="cd-metric-label">CHALLENGES</span>
            <div className="cd-metric-data">
              <span className="cd-metric-number">{companyMetrics.challenges.active}<br/><small className="sub-line">ACTIVE OF {companyMetrics.challenges.total} TOTAL</small></span>
              <div className="cd-circular-chart">
                <svg viewBox="0 0 36 36" className="circular-chart green">
                  <path className="circle-bg"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path className="circle"
                    strokeDasharray={`${companyMetrics.challenges.percentage}, 100`}
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <text x="18" y="20.35" className="percentage">{companyMetrics.challenges.percentage}%</text>
                </svg>
              </div>
            </div>
          </div>

          <div className="cd-metric-card light-card">
            <span className="cd-metric-label">SUBMISSION VELOCITY</span>
            <div className="cd-metric-data">
              <span className="cd-metric-number">{companyMetrics.submissionVelocity.average} <small className="sub-line">DAILY AVG</small></span>
              <div className="cd-sparkline">
                <div className="spark s1"></div>
                <div className="spark s2"></div>
                <div className="spark s3"></div>
                <div className="spark s4"></div>
                <div className="spark s5"></div>
                <div className="spark s6"></div>
                <div className="spark s7"></div>
              </div>
            </div>
          </div>

          <div className="cd-metric-card dark-card prize-card">
            <div className="prize-icon-bg"></div>
            <span className="cd-metric-label">TOTAL PRIZE POOL</span>
            <div className="cd-metric-data">
              <span className="cd-metric-number prize-number">{companyMetrics.prizePool.total}<br/><small className="sub-line">{companyMetrics.prizePool.subtitle}</small></span>
            </div>
          </div>
        </div>

        {/* Ledger Table */}
        <div className="cd-ledger-section outline-box">
          <div className="cd-ledger-header">
            <div>
              <h2>Operational Challenges</h2>
              <p>SCIENTIFIC PROTOCOL REGISTRY V1.02</p>
            </div>
            <div className="cd-ledger-actions">
               <button className="cd-outline-btn">EXPORT LEDGER</button>
               <button className="cd-outline-btn">FILTER</button>
            </div>
          </div>

          <table className="cd-ledger-table">
            <thead>
              <tr>
                <th>STATUS</th>
                <th>IDENTIFICATION</th>
                <th>VOLUME</th>
                <th>DEADLINE</th>
                <th>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {operationalLedger.map((item) => (
                <tr key={item.id}>
                  <td>
                    <span className={`cd-status ${item.status}`}>
                      <span className="dot"></span>{item.status.toUpperCase()}
                    </span>
                  </td>
                  <td>
                    <span className={`ledger-title ${item.status === 'closed' ? 'mute' : ''}`}>{item.title}</span>
                    <span className="ledger-sec">SECT: {item.section}</span>
                  </td>
                  <td>
                    <div className={`volume-col ${item.status === 'closed' ? 'mute' : ''}`}>
                      <span>{item.volumeCount}</span>
                      {item.volumePercent && (
                        <div className="vol-bar">
                          <div className={`vol-fill ${item.isWarning ? 'warning' : ''}`} style={{ width: `${item.volumePercent}%` }}></div>
                        </div>
                      )}
                    </div>
                  </td>
                  <td>
                    <span className={`ledger-date ${item.status === 'closed' ? 'mute' : ''}`}>{item.deadline}</span>
                  </td>
                  <td>
                    <button className={`ledger-action-btn ${item.status === 'review' ? 'dark' : ''} ${item.status === 'closed' ? 'mute-btn' : ''}`}>
                      {item.actionType === 'view' && <>VIEW DOSSIER <ArrowRight size={14} /></>}
                      {item.actionType === 'assess' && <>ASSESS <BookOpen size={14} /></>}
                      {item.actionType === 'archive' && 'ARCHIVE'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Bottom Split Section */}
        <div className="cd-bottom-grid">
          
          <div className="cd-ai-card">
            <div className="ai-badge">INTELLIGENCE ENGINE</div>
            <h2>Analyze Patterns<br/>with Research AI</h2>
            <p>Extract synergistic opportunities from thousands of cross-discipline submissions using our proprietary large-scale models.</p>
            <button className="ai-execute-btn">EXECUTE MATRIX ANALYSIS</button>
            <div className="ai-target-graphics">
               <div className="ring r1"></div>
               <div className="ring r2"></div>
               <div className="ring r3"></div>
            </div>
          </div>

          <div className="cd-side-modular">
             <div className="cd-modular-card">
                <span className="modular-label">LATEST SYNTHESIS</span>
                <p className="synthesis-quote">
                  "Cross-discipline submissions from Bio and InfoSec are up 22% this quarter."
                </p>
                <div className="trend-line">TREND ENGINE ALPHA</div>
             </div>

             <div className="cd-modular-card">
                <span className="modular-label">SCIENTIFIC RUBRIC ASSISTANCE</span>
                <p className="rubric-text">
                  Need help drafting your next technical challenge requirements?
                </p>
                <button className="cd-link-btn">CONSULT RESEARCH AI</button>
             </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default CompanyDashboard;
