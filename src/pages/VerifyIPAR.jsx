import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../lib/api';
import './WorkflowPages.css';

const VerifyIPAR = () => {
  const { iparId } = useParams();
  const [record, setRecord] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/api/ipar/${iparId}/public`).then(setRecord).catch((err) => setError(err.message));
  }, [iparId]);

  return (
    <div className="workflow-page container">
      <div className="workflow-header">
        <h1 className="workflow-title">Public verification</h1>
        <p className="workflow-subtitle">Minimal public verification page built in the current UI tone.</p>
      </div>

      <div className="workflow-card" style={{ maxWidth: 760, margin: '0 auto' }}>
        {error ? <div className="workflow-banner error">{error}</div> : null}
        {record ? <div className="workflow-code">{JSON.stringify(record, null, 2)}</div> : <div className="workflow-banner">Loading verification record...</div>}
        <div className="workflow-actions" style={{ marginTop: '1rem' }}>
          <Link className="primary-btn" to="/">Learn more about Innova</Link>
          <Link className="text-btn" to="/join">Register to participate</Link>
        </div>
      </div>
    </div>
  );
};

export default VerifyIPAR;
