import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Download, Lock, ThumbsUp, MessageSquare, GitFork, ChevronDown } from 'lucide-react';
import './ChallengeDetails.css';

const ChallengeDetails = () => {
  return (
    <div className="challenge-details-page container">
      <Link to="/challenges" className="back-link">
        <ArrowLeft size={16} /> Back to challenges
      </Link>

      <div className="details-content-grid">
        <div className="main-content">
          <div className="header-host">
            <div className="host-logo">S</div>
            <span className="host-name">Synthetix Labs</span>
            <span className="badge-verified">✓ VERIFIED PARTNER</span>
          </div>
          <h1 className="details-title">The Carbon-Neutral Logistics Algorithm Challenge</h1>
          <p className="details-description">
            Design a decentralized routing protocol that minimizes carbon emissions for last-mile delivery fleets while maintaining under-60-minute delivery SLAs in dense urban environments.
          </p>

          <div className="timeline-banner">
            <div className="timeline-banner-header">
              <span className="current-phase-label">CURRENT PHASE : SEALED PHASE</span>
              <span className="time-left">Ends in 14 days</span>
            </div>
            <div className="timeline-progress-bar">
              <div className="progress-fill"></div>
              <div className="progress-node filled"></div>
              <div className="progress-node filled current"></div>
              <div className="progress-node"></div>
              <div className="progress-node"></div>
            </div>
            <div className="timeline-labels">
              <span>Challenge posted</span>
              <span className="active">Sealed phase</span>
              <span>Open phase</span>
              <span>Judging</span>
            </div>
          </div>

          <details className="description-dropdown" open>
            <summary className="description-summary">
              <h2 className="description-title">Description</h2>
              <ChevronDown size={28} className="dropdown-icon" />
            </summary>
            
            <div className="description-content">
              <section className="detail-section">
                <h2 className="section-heading bordered">The problem</h2>
                <div className="section-body">
                  <p>Current routing algorithms optimize for the shortest path or the fastest time, often ignoring the energy-load variations caused by traffic density and vehicle weight changes. In urban centers, this lead to a 15% inefficiency in battery consumption for electric fleets.</p>
                  <br />
                  <p>We are seeking a novel approach that treats carbon-cost as a primary variable in the optimization function, rather than an afterthought.</p>
                </div>
              </section>

              <section className="detail-section">
                <h2 className="section-heading bordered">Constraints</h2>
                <div className="section-body constraints-list">
                  <div className="constraint-item">
                    <CheckCircle2 size={16} className="check-icon" />
                    <span>Must be compatible with Python 3.10+ and PyTorch frameworks.</span>
                  </div>
                  <div className="constraint-item">
                    <CheckCircle2 size={16} className="check-icon" />
                    <span>API latency for re-routing must not exceed 200ms.</span>
                  </div>
                  <div className="constraint-item">
                    <CheckCircle2 size={16} className="check-icon" />
                    <span>Algorithm must handle at least 50 concurrent vehicle nodes.</span>
                  </div>
                </div>
              </section>

              <section className="detail-section">
                <h2 className="section-heading bordered">Judging criteria</h2>
                <div className="criteria-grid">
                  <div className="criteria-card">
                    <span className="weight-badge">WEIGHT : 40%</span>
                    <h4 className="criteria-title">Carbon Efficiency</h4>
                    <p className="criteria-desc">Measured reduction in Watt-hours per kilometer compared to the baseline OSRM engine.</p>
                  </div>
                  <div className="criteria-card">
                    <span className="weight-badge">WEIGHT : 30%</span>
                    <h4 className="criteria-title">Algorithm Scalability</h4>
                    <p className="criteria-desc">The ability to maintain performance as node density increases exponentially.</p>
                  </div>
                </div>
              </section>
            </div>
          </details>

          <section className="detail-section">
            <h2 className="section-heading bordered">Resources</h2>
            <div className="resources-list">
              <div className="resource-item">
                <div className="resource-name">📄 Technical Dataset v1.2 (.csv)</div>
                <Download size={18} className="download-icon" />
              </div>
              <div className="resource-item">
                <div className="resource-name">📁 Baseline Model weights (.pt)</div>
                <Download size={18} className="download-icon" />
              </div>
            </div>
          </section>

          <section className="detail-section submissions-section">
            <div className="submissions-header">
              <h2 className="section-heading bordered">Submissions</h2>
              <span className="badge-dark">🔒 SEALED PHASE</span>
            </div>

            <div className="sealed-banner">
              <Lock size={24} className="locked-icon" />
              <p>Submissions are currently hidden to <strong>prevent bias</strong>.<br />Once the phase ends, all 42 entries will be revealed.</p>
            </div>

            <div className="mock-submission-card">
              <div className="mock-author">
                <div className="mock-avatar">M</div>
                <div className="mock-author-info">
                  <div className="mock-name">Marcus Chen</div>
                  <div className="mock-title">SENIOR RESEARCHER</div>
                </div>
              </div>
              <h4 className="mock-title-text">Graph-based Stochastic Routing v2</h4>
              <div className="mock-image-placeholder"></div>
              <div className="mock-actions">
                <span className="action-item"><ThumbsUp size={14} /> 12</span>
                <span className="action-item"><MessageSquare size={14} /> 4</span>
                <span className="action-item right"><GitFork size={14} /> Fork</span>
              </div>
            </div>
          </section>
        </div>

        <aside className="details-sidebar">
          <div className="prize-card">
            <div className="prize-label">GRAND PRIZE</div>
            <div className="prize-value">₹12,500</div>
            <div className="prize-sub">IN USDC + GRANTS</div>
          </div>

          <div className="stats-card">
            <div className="stat-row">
              <span className="stat-key">PHASE</span>
              <span className="stat-val">Sealed</span>
            </div>
            <div className="stat-row">
              <span className="stat-key">SUBMISSIONS</span>
              <span className="stat-val">42</span>
            </div>
            <div className="stat-row">
              <span className="stat-key">PARTICIPANTS</span>
              <span className="stat-val">128</span>
            </div>
            <div className="stat-row">
              <span className="stat-key">DIFFICULTY</span>
              <span className="stat-val">Expert</span>
            </div>
            <Link to="/submit" className="full-width" style={{ display: 'block' }}>
              <button className="primary-btn full-width">Submit your idea</button>
            </Link>
            <button className="outline-btn full-width mt-2">Follow updates</button>
          </div>

          <div className="host-info-card">
            <div className="host-label">ABOUT THE HOST</div>
            <div className="host-details">
              <div className="host-logo-small">S</div>
              <div className="host-text">
                <div className="host-name-small">Synthetix Labs</div>
                <div className="host-desc-small">Autonomous systems research</div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default ChallengeDetails;
