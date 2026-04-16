import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../lib/api';
import './WorkflowPages.css';

const IPARDetail = () => {
  const { iparId } = useParams();
  const [record, setRecord] = useState(null);

  useEffect(() => {
    api.get(`/api/ipar/${iparId}`).then(setRecord);
  }, [iparId]);

  if (!record) {
    return <div className="workflow-page container"><div className="workflow-card">Loading IPAR record...</div></div>;
  }

  return (
    <div className="workflow-page container">
      <div className="workflow-header">
        <h1 className="workflow-title">IPAR Record</h1>
        <p className="workflow-subtitle">Backend-connected detail view using the same restrained UI style.</p>
      </div>

      <div className="workflow-grid">
        <div className="workflow-card">
          <h2>Verification data</h2>
          <div className="workflow-code">{JSON.stringify(record, null, 2)}</div>
        </div>
        <div className="workflow-stack">
          <div className="workflow-card">
            <h3>Actions</h3>
            <div className="workflow-actions">
              <a className="primary-btn" href={`/api/ipar/${iparId}/certificate`}>Download certificate</a>
              <button className="text-btn" onClick={() => navigator.clipboard.writeText(`${window.location.origin}/verify/ipar/${iparId}`)}>Share verification link</button>
            </div>
          </div>
          <div className="workflow-card">
            <h3>Related links</h3>
            <div className="workflow-stack">
              <Link to={`/challenge/${record.challenge_id}`}>Challenge</Link>
              <Link to={`/challenge/${record.challenge_id}`}>Submission</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IPARDetail;
