import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './AuthNavbar.css';

const AuthNavbar = () => {
  const location = useLocation();
  const isLogin = location.pathname === '/login';

  return (
    <nav className="auth-navbar container">
      <Link to="/" className="auth-nav-logo">Innova</Link>

      <div className="auth-nav-actions">
        <Link 
          to="/login" 
          className={isLogin ? "primary-btn" : "login-btn text-btn"}
        >
          Sign In
        </Link>
        <Link 
          to="/join" 
          className={!isLogin ? "primary-btn" : "login-btn text-btn"}
        >
          Sign Up
        </Link>
      </div>
    </nav>
  );
};

export default AuthNavbar;
