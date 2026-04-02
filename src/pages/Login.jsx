import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Join.css'; // Reusing the Auth styles

const Login = () => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Dummy login logic
    navigate('/dashboard');
  };

  return (
    <div className="auth-page">
      <div className="auth-form-container">
        <div className="auth-pill">INNOVA MANUSCRIPT V.24</div>
        <h1 className="auth-title">Welcome back</h1>
        <p className="auth-subtitle">Continue your journey with the collective.</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-form-group">
            <label>EMAIL ADDRESS</label>
            <input type="email" placeholder="archer@innova.org" defaultValue="archer@innova.org" required />
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
