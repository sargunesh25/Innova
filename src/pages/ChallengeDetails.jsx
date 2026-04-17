import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Download, Lock, ThumbsUp, MessageSquare, GitFork, Loader2 } from 'lucide-react';
import { useDashboardInfo } from '../context/DashboardContext';
import { api } from '../lib/api';
import './ChallengeDetails.css';

const normalizeChallenge = (c) => ({
  id: c.id,
  title: c.title,
  description: c.description || c.summary || '',
  image: c.image_url || c.image || '',
  host: {
    name: c.company_name || c.poster?.name || c.host?.name || 'Innova Partner',
    logoInitial: (c.company_name || c.poster?.name || c.host?.name || 'I').slice(0, 1).toUpperCase(),
    verified: Boolean(c.poster?.verified || c.host?.verified || c.company_verified),
    description: c.poster?.description || c.host?.description || 'Autonomous systems research',
  },
  problemStatement: c.problem_statement || c.summary || c.description || '',
  problemDetail: c.problem_detail || c.details || '',
  constraints: c.constraints || c.requirements || [],
  judgingCriteria: (c.criteria || c.judging_criteria || []).map((item) => ({
    title: item.title || item.name,
    weight: item.weight || 0,
    desc: item.desc || item.description || '',
  })),
  resources: c.resources || [],
  submissions: Number(c.submission_count || 0),
  participants: Number(c.participant_count || 0),
  difficulty: c.difficulty || 'Open',
  currentPhase: c.current_phase_label || c.current_phase || 'Open',
  timeLeft: c.time_left || (c.days_remaining ? `${c.days_remaining} days remaining` : 'TBD'),
  grandPrize: `₹${Number(c.prize_pool || c.prize || c.prize_value || 0).toLocaleString('en-IN')}`,
  prizeType: c.prize_type || 'Prize pool',
});

const ChallengeDetails = () => {
  const { id } = useParams();
  const { challengesList, isLoading, fetchChallenges, followChallenge } = useDashboardInfo();
  const [challengeData, setChallengeData] = useState(null);
  const [followLoading, setFollowLoading] = useState(false);
  const [followed, setFollowed] = useState(false);

  useEffect(() => {
    let mounted = true;

    api.get(`/api/challenges/${id}`)
      .then((data) => {
        if (mounted) setChallengeData(normalizeChallenge(data));
      })
      .catch(() => {
        if (challengesList.length === 0) {
          fetchChallenges();
        }
      });

    return () => {
      mounted = false;
    };
  }, [id, challengesList.length, fetchChallenges]);

  const handleFollow = async () => {
    setFollowLoading(true);
    const result = await followChallenge(id);
    if (result.success) setFollowed(true);
    setFollowLoading(false);
  };

  if (isLoading && !challengeData) {
    return (
      <div className="challenge-details-page container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <Loader2 size={48} color="var(--brand-green)" style={{ animation: 'spin 2s linear infinite', marginBottom: '1rem' }} />
        <p style={{ color: 'var(--text-secondary)', fontWeight: 600, letterSpacing: '1px' }}>LOADING CHALLENGE...</p>
        <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const challenge = challengeData || challengesList.find((c) => String(c.id) === String(id));

  if (!challenge) {
    return (
      <div className="challenge-details-page container" style={{ textAlign: 'center', padding: '6rem 2rem' }}>
        <h2>Challenge not found</h2>
        <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>The challenge you're looking for doesn't exist or has been removed.</p>
        <Link to="/challenges" className="primary-btn" style={{ display: 'inline-block', marginTop: '1.5rem' }}>Back to Challenges</Link>
      </div>
    );
  }

  const currentPhase = challenge.currentPhase || 'Open';
  const phaseIndex = currentPhase === 'Sealed' ? 1 : currentPhase === 'Evaluation' ? 2 : currentPhase === 'Completed' ? 3 : 0;
  const progressWidth = ((phaseIndex + 1) / 4) * 100;

  return (
    <div className="challenge-details-page container">
      <Link to="/challenges" className="back-link">
        <ArrowLeft size={16} /> Back to challenges
      </Link>

      <div className="details-content-grid">
        <div className="main-content">
          <div className="header-host">
            <div className="host-logo">{challenge.host.logoInitial}</div>
            <span className="host-name">{challenge.host.name}</span>
            {challenge.host.verified && <span className="badge-verified">✓ VERIFIED PARTNER</span>}
          </div>
          <h1 className="details-title">{challenge.title}</h1>
          <p className="details-description">{challenge.description}</p>

          {challenge.image ? (
            <div className="details-hero-image-wrap">
              <img src={challenge.image} alt={challenge.title} className="details-hero-image" />
            </div>
          ) : null}

          <div className="timeline-banner">
            <div className="timeline-banner-header">
              <span className="current-phase-label">CURRENT PHASE : {String(currentPhase).toUpperCase()} PHASE</span>
              <span className="time-left">{challenge.timeLeft || 'TBD'}</span>
            </div>
            <div className="timeline-progress-bar">
              <div className="progress-fill" style={{ width: `${progressWidth}%` }}></div>
              <div className={`progress-node ${phaseIndex >= 0 ? 'filled' : ''}`}></div>
              <div className={`progress-node ${phaseIndex >= 1 ? 'filled' : ''} ${phaseIndex === 1 ? 'current' : ''}`}></div>
              <div className={`progress-node ${phaseIndex >= 2 ? 'filled' : ''} ${phaseIndex === 2 ? 'current' : ''}`}></div>
              <div className={`progress-node ${phaseIndex >= 3 ? 'filled' : ''} ${phaseIndex === 3 ? 'current' : ''}`}></div>
            </div>
            <div className="timeline-labels">
              <span className={phaseIndex === 0 ? 'active' : ''}>Challenge posted</span>
              <span className={phaseIndex === 1 ? 'active' : ''}>Sealed phase</span>
              <span className={phaseIndex === 2 ? 'active' : ''}>Open phase</span>
              <span className={phaseIndex === 3 ? 'active' : ''}>Judging</span>
            </div>
          </div>

          <div className="description-content mt-4">
            <section className="detail-section">
              <h2 className="section-heading bordered">The problem</h2>
              <div className="section-body">
                <p>{challenge.problemStatement}</p>
                <br />
                <p>{challenge.problemDetail}</p>
              </div>
            </section>

            <section className="detail-section">
              <h2 className="section-heading bordered">Constraints</h2>
              <div className="section-body constraints-list">
                {challenge.constraints.map((c, i) => (
                  <div key={i} className="constraint-item">
                    <CheckCircle2 size={16} className="check-icon" />
                    <span>{c}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="detail-section">
              <h2 className="section-heading bordered">Judging criteria</h2>
              <div className="criteria-grid">
                {challenge.judgingCriteria.map((jc, i) => (
                  <div key={i} className="criteria-card">
                    <span className="weight-badge">WEIGHT : {jc.weight}%</span>
                    <h4 className="criteria-title">{jc.title}</h4>
                    <p className="criteria-desc">{jc.desc}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <section className="detail-section">
            <h2 className="section-heading bordered">Resources</h2>
            <div className="resources-list">
              {challenge.resources.map((res, i) => (
                <a key={i} className="resource-item" href={res.url || '#'} target={res.url ? '_blank' : undefined} rel={res.url ? 'noreferrer' : undefined}>
                  <div className="resource-name">{res.name}</div>
                  <Download size={18} className="download-icon" />
                </a>
              ))}
            </div>
          </section>

          <section className="detail-section submissions-section">
            <div className="submissions-header">
              <h2 className="section-heading bordered">Submissions</h2>
              <span className="badge-dark">🔒 {String(currentPhase).toUpperCase()} PHASE</span>
            </div>

            <div className="sealed-banner">
              <Lock size={24} className="locked-icon" />
              <p>Submissions are currently hidden to <strong>prevent bias</strong>.<br />Once the phase ends, all {challenge.submissions} entries will be revealed.</p>
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
            <div className="prize-value">{challenge.grandPrize}</div>
            <div className="prize-sub">{challenge.prizeType}</div>
          </div>

          <div className="stats-card">
            <div className="stat-row">
              <span className="stat-key">PHASE</span>
              <span className="stat-val">{currentPhase}</span>
            </div>
            <div className="stat-row">
              <span className="stat-key">SUBMISSIONS</span>
              <span className="stat-val">{challenge.submissions}</span>
            </div>
            <div className="stat-row">
              <span className="stat-key">PARTICIPANTS</span>
              <span className="stat-val">{challenge.participants}</span>
            </div>
            <div className="stat-row">
              <span className="stat-key">DIFFICULTY</span>
              <span className="stat-val">{challenge.difficulty}</span>
            </div>
            <Link to={`/submit?challengeId=${challenge.id}`} className="full-width" style={{ display: 'block' }}>
              <button className="primary-btn full-width">Submit your idea</button>
            </Link>
            <button
              className={`outline-btn full-width mt-2 ${followed ? 'followed' : ''}`}
              onClick={handleFollow}
              disabled={followLoading || followed}
            >
              {followed ? '✓ Following' : followLoading ? 'Following...' : 'Follow updates'}
            </button>
          </div>

          <div className="host-info-card">
            <div className="host-label">ABOUT THE HOST</div>
            <div className="host-details">
              <div className="host-logo-small">{challenge.host.logoInitial}</div>
              <div className="host-text">
                <div className="host-name-small">{challenge.host.name}</div>
                <div className="host-desc-small">{challenge.host.description}</div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default ChallengeDetails;
