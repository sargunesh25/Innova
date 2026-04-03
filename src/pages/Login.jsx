import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlignLeft, Building2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Join.css'; // Reusing the Auth styles

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loginRole, setLoginRole] = useState('solver');

  const handleSubmit = (e) => {
    e.preventDefault();
    login(loginRole);
    navigate('/dashboard');
  };

  return (
    <div className="auth-page">
      <div className="auth-form-container">
        <div className="auth-pill">INNOVA MANUSCRIPT V.24</div>
        <h1 className="auth-title">Welcome back</h1>
        <p className="auth-subtitle">Continue your journey with the collective.</p>

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

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-form-group">
            <label>EMAIL ADDRESS</label>
            <input type="email" placeholder={loginRole === 'company' ? "admin@innovasys.com" : "archer@innova.org"} defaultValue={loginRole === 'company' ? "admin@innovasys.com" : "archer@innova.org"} required />
          </div>

          <div className="auth-form-group">
            <label>SECURITY PASSWORD</label>
            <input type="password" placeholder="••••••••••••" defaultValue="password123" required />
          </div>

          <button type="submit" className="primary-btn full-width">SIGN IN</button>
          
          <p className="auth-terms">
            By proceeding, you agree to our <a href="#">Terms</a> and <a href="#">Privacy Policy</a>.
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
