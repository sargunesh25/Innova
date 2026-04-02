import React from 'react';
import { Plus, ArrowRight, BookOpen } from 'lucide-react';
import './CompanyDashboard.css';

const CompanyDashboard = () => {
  return (
    <div className="company-dashboard">
      
      {/* Header Plate */}
      <div className="cd-header container">
        <div className="cd-header-left">
          <div className="company-logo-block">
             {/* Simple visual SVG or block */}
             <div className="cd-logo-standin">
                <div className="cd-logo-leaf">&#127807;</div>
                <span>COMPANY</span>
             </div>
          </div>
          <div className="company-title-info">
            <h1>Innova Systems <span className="cd-section-badge">SECTION 02</span></h1>
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
              <span className="cd-metric-number">1,284 <small>+12%</small></span>
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
              <span className="cd-metric-number">12<br/><small className="sub-line">ACTIVE OF 42 TOTAL</small></span>
              <div className="cd-circular-chart">
                <svg viewBox="0 0 36 36" className="circular-chart green">
                  <path className="circle-bg"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path className="circle"
                    strokeDasharray="28, 100"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <text x="18" y="20.35" className="percentage">28%</text>
                </svg>
              </div>
            </div>
          </div>

          <div className="cd-metric-card light-card">
            <span className="cd-metric-label">SUBMISSION VELOCITY</span>
            <div className="cd-metric-data">
              <span className="cd-metric-number">84.2 <small className="sub-line">DAILY AVG</small></span>
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
              <span className="cd-metric-number prize-number">$2.4M<br/><small className="sub-line">COMMITTED CAPITAL FY24</small></span>
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
              <tr>
                <td><span className="cd-status active"><span className="dot"></span>ACTIVE</span></td>
                <td>
                  <span className="ledger-title">Neural Pathway Mapping v.2</span>
                  <span className="ledger-sec">SECT: BIO-TECHNICAL ENG.</span>
                </td>
                <td>
                   <div className="volume-col">
                     <span>124</span>
                     <div className="vol-bar"><div className="vol-fill" style={{width:'80%'}}></div></div>
                   </div>
                </td>
                <td><span className="ledger-date">24.OCT.24</span></td>
                <td><button className="ledger-action-btn">VIEW DOSSIER <ArrowRight size={14}/></button></td>
              </tr>
              <tr>
                <td><span className="cd-status review"><span className="dot"></span>REVIEW</span></td>
                <td>
                  <span className="ledger-title">Sub-Surface Mineral Scanners</span>
                  <span className="ledger-sec">SECT: RESOURCE MANAGEMENT</span>
                </td>
                <td>
                   <div className="volume-col">
                     <span>48</span>
                     <div className="vol-bar"><div className="vol-fill warning" style={{width:'40%'}}></div></div>
                   </div>
                </td>
                <td><span className="ledger-date">12.SEP.24</span></td>
                <td><button className="ledger-action-btn dark">ASSESS <BookOpen size={14}/></button></td>
              </tr>
              <tr>
                <td><span className="cd-status closed"><span className="dot"></span>CLOSED</span></td>
                <td>
                  <span className="ledger-title mute">Quantum Cryptography Standards</span>
                  <span className="ledger-sec">SECT: INFO SECURITY</span>
                </td>
                <td>
                   <div className="volume-col mute">
                     <span>312</span>
                   </div>
                </td>
                <td><span className="ledger-date mute">FINALIZED</span></td>
                <td><button className="ledger-action-btn mute-btn">ARCHIVE</button></td>
              </tr>
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
