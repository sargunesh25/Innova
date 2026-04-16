import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api, withQuery } from '../lib/api';
import './WorkflowPages.css';

const CompanyPublic = () => {
  const { posterId } = useParams();
  const [company, setCompany] = useState(null);
  const [active, setActive] = useState([]);
  const [completed, setCompleted] = useState([]);

  useEffect(() => {
    Promise.all([
      api.get(`/api/companies/${posterId}`),
      api.get(withQuery('/api/challenges', { poster_id: posterId, status: 'active' })),
      api.get(withQuery('/api/challenges', { poster_id: posterId, status: 'completed', limit: 6 })),
    ]).then(([companyData, activeData, completedData]) => {
      setCompany(companyData);
      setActive(activeData?.items || activeData || []);
      setCompleted(completedData?.items || completedData || []);
    });
  }, [posterId]);

  if (!company) {
    return <div className="workflow-page container"><div className="workflow-card">Loading company page...</div></div>;
  }

  return (
    <div className="workflow-page container">
      <div className="workflow-header">
        <h1 className="workflow-title">{company.name}</h1>
        <p className="workflow-subtitle">{company.description || 'Public poster profile connected to backend company endpoints.'}</p>
      </div>

      <div className="workflow-grid">
        <div className="workflow-stack">
          <div className="workflow-card">
            <h2>Active challenges</h2>
            <div className="workflow-list">
              {active.map((item) => <Link key={item.id} to={`/challenge/${item.id}`} className="workflow-item"><div><div className="workflow-item-title">{item.title}</div><div className="workflow-item-meta">{item.category || 'Challenge'}</div></div></Link>)}
            </div>
          </div>
          <div className="workflow-card">
            <h2>Past challenges</h2>
            <div className="workflow-list">
              {completed.map((item) => <Link key={item.id} to={`/challenge/${item.id}`} className="workflow-item"><div><div className="workflow-item-title">{item.title}</div><div className="workflow-item-meta">{item.completed_at ? new Date(item.completed_at).toLocaleDateString() : 'Completed'}</div></div></Link>)}
            </div>
          </div>
        </div>
        <div className="workflow-stack">
          <div className="workflow-card">
            <h3>Company profile</h3>
            <div className="workflow-metrics">
              <div className="workflow-metric"><span>Verified</span><strong>{company.verified ? 'Yes' : 'No'}</strong></div>
              <div className="workflow-metric"><span>Rating</span><strong>{company.rating || 'N/A'}</strong></div>
              <div className="workflow-metric"><span>Website</span><strong>{company.website ? 'Live' : 'N/A'}</strong></div>
            </div>
            {company.website ? <a href={company.website} target="_blank" rel="noreferrer" className="primary-btn" style={{ marginTop: '1rem', display: 'inline-flex' }}>Visit website</a> : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyPublic;
