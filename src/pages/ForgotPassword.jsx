import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';
import './WorkflowPages.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await api.post('/api/auth/forgot-password', { email });
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="workflow-page container">
      <div className="workflow-header">
        <h1 className="workflow-title">Forgot password</h1>
        <p className="workflow-subtitle">Request a reset link from the backend without changing the current design language.</p>
      </div>

      <div className="workflow-card" style={{ maxWidth: 560, margin: '0 auto' }}>
        {success ? (
          <div className="workflow-stack">
            <div className="workflow-banner">Check your email for the reset link.</div>
            <Link to="/login" className="primary-btn" style={{ alignSelf: 'flex-start' }}>Back to login</Link>
          </div>
        ) : (
          <form className="workflow-form" onSubmit={handleSubmit}>
            {error ? <div className="workflow-banner error">{error}</div> : null}
            <label>
              EMAIL ADDRESS
              <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
            </label>
            <div className="workflow-actions">
              <button type="submit" className="primary-btn" disabled={submitting}>{submitting ? 'SENDING...' : 'SEND RESET LINK'}</button>
              <Link to="/login" className="text-btn">Back to login</Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
