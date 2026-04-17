import React, { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { AlignLeft, Building2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Join.css';

const Join = () => {
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get('role') === 'company' ? 'company' : 'solver';
  const [accountType, setAccountType] = useState(initialRole);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');
  const [emailSent, setEmailSent] = useState(false);

  const navigate = useNavigate();
  const { register, authLoading, authError } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');

    if (!name.trim() || !email.trim() || !password.trim()) {
      setLocalError('Please fill in all fields.');
      return;
    }
    if (password.length < 8) {
      setLocalError('Password must be at least 8 characters.');
      return;
    }

    const result = await register({ name, email, password, role: accountType });
    if (result.success) {
      // Supabase sends a confirmation email — show the check-email screen
      setEmailSent(true);
    }
    // authError in context will show server-side error
  };

  const error = localError || authError;

  // ─── Email confirmation screen ───────────────────────────────────────────
  if (emailSent) {
    return (
      <div className="auth-page">
        <div className="auth-form-container" style={{ textAlign: 'center', gap: '1rem' }}>
          <div className="auth-pill">INNOVA MANUSCRIPT V.24</div>
          <h1 className="auth-title" style={{ fontSize: '1.8rem' }}>Account created successfully</h1>
          <p className="auth-subtitle" style={{ maxWidth: '340px' }}>
            A verification email has been sent to <strong>{email}</strong>.<br />
            Please verify your email to activate your account.
          </p>
          <Link
            to="/login"
            className="primary-btn"
            style={{ display: 'inline-block', marginTop: '1.5rem', padding: '0.85rem 2rem', textDecoration: 'none' }}
          >
            Login
          </Link>
          <p className="auth-terms" style={{ marginTop: '1rem' }}>
            Didn't receive it? Check spam or{' '}
            <span
              style={{ color: 'var(--brand-green)', cursor: 'pointer', fontWeight: 600 }}
              onClick={() => setEmailSent(false)}
            >
              try again
            </span>.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-form-container">
        <div className="auth-pill">INNOVA MANUSCRIPT V.24</div>
        <h1 className="auth-title">Join the collective</h1>
        <p className="auth-subtitle">Step into a space where technical precision meets historical elegance.</p>

        {/* Role selector */}
        <div className="auth-type-selector">
          <div
            className={`auth-type-card ${accountType === 'solver' ? 'selected' : ''}`}
            onClick={() => setAccountType('solver')}
          >
            <AlignLeft className="auth-type-icon" size={20} />
            <div className="auth-type-info">
              <strong>Researcher</strong>
              <span>MEMBER</span>
            </div>
          </div>
          <div
            className={`auth-type-card ${accountType === 'company' ? 'selected' : ''}`}
            onClick={() => setAccountType('company')}
          >
            <Building2 className="auth-type-icon" size={20} />
            <div className="auth-type-info">
              <strong>Company</strong>
              <span>PARTNER</span>
            </div>
          </div>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="auth-error-banner">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-form-group">
            <label>FULL NAME</label>
            <input
              type="text"
              placeholder={accountType === 'company' ? 'Company or contact name' : 'Your full name'}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoComplete="name"
            />
          </div>

          <div className="auth-form-group">
            <label>EMAIL ADDRESS</label>
            <input
              type="email"
              placeholder={accountType === 'company' ? 'admin@company.com' : 'you@innova.org'}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className="auth-form-group">
            <label>SECURITY PASSWORD</label>
            <input
              type="password"
              placeholder="Min. 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
            />
          </div>

          <button
            type="submit"
            className="primary-btn full-width"
            disabled={authLoading}
          >
            {authLoading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
          </button>

          <p className="auth-terms">
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--brand-green)', fontWeight: 600 }}>
              Sign in
            </Link>
          </p>

          <p className="auth-terms">
            By proceeding, you agree to our <Link to="/terms">Terms</Link> and <Link to="/privacy">Privacy Policy</Link>.
          </p>
        </form>
      </div>
    </div>
  );
};

export default Join;
