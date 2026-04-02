import React from 'react';
import './AuthFooter.css';

const AuthFooter = () => {
  return (
    <footer className="auth-footer container">
      <div className="auth-footer-logo">Innova</div>
      <div className="auth-footer-links">
        <a href="#">PRIVACY</a>
        <a href="#">TERMS</a>
        <a href="#">SUPPORT</a>
      </div>
      <div className="auth-footer-copy">
        &copy; 2024 INNOVA MANUSCRIPT.
      </div>
    </footer>
  );
};

export default AuthFooter;
