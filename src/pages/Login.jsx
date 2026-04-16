import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AlignLeft, Building2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Join.css';

const Login = () => {
  const navigate = useNavigate();
  const { login, authLoading, authError } = useAuth();

  const [loginRole, setLoginRole] = useState('solver');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');

    if (!email.trim() || !password.trim()) {
      setLocalError('Please enter your email and password.');
      return;
    }

    const result = await login(email, password);
    if (result.success) {
      navigate('/dashboard');
    }
    // authError in context will show the server error automatically
  };

  const error = localError || authError;

  return (
    <div className="auth-page">
      <div className="auth-form-container">
        <div className="auth-pill">INNOVA MANUSCRIPT V.24</div>
        <h1 className="auth-title">Welcome back</h1>
        <p className="auth-subtitle">Continue your journey with the collective.</p>

        {/* Role selector (determines which endpoint context to show) */}
        <div className="auth-type-selector">
          <div
            className={`auth-type-card ${loginRole === 'solver' ? 'selected' : ''}`}
            onClick={() => setLoginRole('solver')}
          >
            <AlignLeft className="auth-type-icon" size={20} />
            <div className="auth-type-info">
              <strong>Researcher</strong>
              <span>MEMBER</span>
            </div>
          </div>
          <div
            className={`auth-type-card ${loginRole === 'company' ? 'selected' : ''}`}
            onClick={() => setLoginRole('company')}
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
            <label>EMAIL ADDRESS</label>
            <input
              type="email"
              placeholder={loginRole === 'company' ? 'admin@company.com' : 'you@innova.org'}
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
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            className="primary-btn full-width"
            disabled={authLoading}
          >
            {authLoading ? 'SIGNING IN...' : 'SIGN IN'}
          </button>

          <p className="auth-terms">
            Don't have an account?{' '}
            <Link to="/join" style={{ color: 'var(--brand-green)', fontWeight: 600 }}>
              Join the collective
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

export default Login;
