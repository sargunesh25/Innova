import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '../lib/api';
import './WorkflowPages.css';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const [validating, setValidating] = useState(true);
  const [valid, setValid] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/api/auth/validate-reset-token?token=${encodeURIComponent(token)}`)
      .then(() => setValid(true))
      .catch(() => setError('This reset link is invalid or expired.'))
      .finally(() => setValidating(false));
  }, [token]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    try {
      await api.post('/api/auth/reset-password', { token, password });
      navigate('/login');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="workflow-page container">
      <div className="workflow-header">
        <h1 className="workflow-title">Reset password</h1>
        <p className="workflow-subtitle">Validate the token, then write the new password back through the backend.</p>
      </div>

      <div className="workflow-card" style={{ maxWidth: 560, margin: '0 auto' }}>
        {validating ? <div className="workflow-banner">Validating reset token...</div> : null}
        {!validating && error ? <div className="workflow-banner error">{error}</div> : null}
        {!validating && valid ? (
          <form className="workflow-form" onSubmit={handleSubmit}>
            <label>
              NEW PASSWORD
              <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
            </label>
            <label>
              CONFIRM PASSWORD
              <input type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} required />
            </label>
            <div className="workflow-actions">
              <button type="submit" className="primary-btn">SET NEW PASSWORD</button>
              <Link to="/login" className="text-btn">Back to login</Link>
            </div>
          </form>
        ) : null}
      </div>
    </div>
  );
};

export default ResetPassword;
