import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api, withQuery } from '../lib/api';
import './WorkflowPages.css';

const ChallengeManage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [challenge, setChallenge] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [preview, setPreview] = useState([]);
  const [scores, setScores] = useState({});

  useEffect(() => {
    Promise.all([
      api.get(`/api/challenges/${id}`),
      api.get(withQuery('/api/submissions', { challenge_id: id, status: 'revealed' })).catch(() => []),
      api.get(`/api/challenges/${id}/pss-preview`).catch(() => []),
    ]).then(([challengeData, submissionData, previewData]) => {
      setChallenge(challengeData);
      setSubmissions(submissionData?.items || submissionData || []);
      setPreview(previewData?.items || previewData || []);
    });
  }, [id]);

  if (!challenge) {
    return <div className="workflow-page container"><div className="workflow-card">Loading challenge management...</div></div>;
  }

  return (
    <div className="workflow-page container">
      <div className="workflow-header">
        <h1 className="workflow-title">{challenge.title}</h1>
        <p className="workflow-subtitle">Poster management route added without changing the existing visual direction.</p>
      </div>

      <div className="workflow-grid">
        <div className="workflow-stack">
          <div className="workflow-card">
            <h2>Challenge status</h2>
            <div className="workflow-metrics">
              <div className="workflow-metric"><span>Phase</span><strong>{challenge.current_phase || 1}</strong></div>
              <div className="workflow-metric"><span>Submissions</span><strong>{challenge.submission_count || submissions.length}</strong></div>
              <div className="workflow-metric"><span>Status</span><strong>{challenge.status || 'active'}</strong></div>
            </div>
            <div className="workflow-actions" style={{ marginTop: '1rem' }}>
              {Number(challenge.current_phase || 1) === 1 ? <Link className="primary-btn" to={`/challenges/${id}/edit`}>Edit challenge</Link> : null}
              <button className="text-btn" onClick={() => api.post(`/api/challenges/${id}/cancel`, {}).then(() => navigate('/dashboard'))}>Close early</button>
            </div>
          </div>

          <div className="workflow-card">
            <h2>Judging</h2>
            <div className="workflow-list">
              {submissions.map((item) => (
                <div key={item.id} className="workflow-item">
                  <div>
                    <div className="workflow-item-title">{item.title || item.id}</div>
                    <div className="workflow-item-meta">{item.contributor_name || item.username || 'Contributor'}</div>
                  </div>
                  <div className="workflow-inline">
                    <input type="number" placeholder="OSS" style={{ width: 90 }} onChange={(event) => setScores((prev) => ({ ...prev, [item.id]: { ...(prev[item.id] || {}), oss: event.target.value } }))} />
                    <input type="number" placeholder="CJS" style={{ width: 90 }} onChange={(event) => setScores((prev) => ({ ...prev, [item.id]: { ...(prev[item.id] || {}), cjs: event.target.value } }))} />
                    <button className="text-btn" onClick={() => api.patch(`/api/judge-scores/${item.id}`, scores[item.id] || {})}>Save</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="workflow-stack">
          <div className="workflow-card">
            <h3>Prize distribution preview</h3>
            <div className="workflow-code">{JSON.stringify(preview, null, 2)}</div>
          </div>
          <div className="workflow-card">
            <h3>Release payment</h3>
            <button className="primary-btn" onClick={() => api.post(`/api/challenges/${id}/release-payment`, {}).then(() => navigate('/dashboard'))}>Approve and release</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChallengeManage;
