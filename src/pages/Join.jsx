import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlignLeft, Building2 } from 'lucide-react';
import './Join.css';

const Join = () => {
  const [accountType, setAccountType] = useState('researcher');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Dummy login/signup logic
    navigate('/dashboard');
  };

  return (
    <div className="auth-page">
      <div className="auth-form-container">
        <div className="auth-pill">INNOVA MANUSCRIPT V.24</div>
        <h1 className="auth-title">Join the collective</h1>
        <p className="auth-subtitle">Step into a space where technical precision meets historical elegance.</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-type-selector">
            <div 
              className={`auth-type-card ${accountType === 'researcher' ? 'selected' : ''}`}
              onClick={() => setAccountType('researcher')}
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

          <div className="auth-form-group">
            <label>FULL NAME</label>
            <input type="text" placeholder="Julian V. Archer" defaultValue="Julian V. Archer" required />
          </div>

          <div className="auth-form-group">
            <label>EMAIL ADDRESS</label>
            <input type="email" placeholder="archer@innova.org" defaultValue="archer@innova.org" required />
          </div>

          <div className="auth-form-group">
            <label>SECURITY PASSWORD</label>
            <input type="password" placeholder="••••••••••••" defaultValue="password123" required />
          </div>

          <button type="submit" className="primary-btn full-width">CREATE ACCOUNT</button>
          
          <p className="auth-terms">
            By proceeding, you agree to our <a href="#">Terms</a> and <a href="#">Privacy Policy</a>.
          </p>
        </form>
      </div>
    </div>
  );
};

export default Join;
