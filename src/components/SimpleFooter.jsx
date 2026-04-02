import React from 'react';
import './SimpleFooter.css';

const SimpleFooter = () => {
  return (
    <footer className="simple-footer container">
      <div className="simple-footer-left">
        <h3 className="simple-footer-logo">Innova Manuscript</h3>
        <p className="simple-footer-copy">&copy; 2024 Innova Manuscript. All rights reserved.</p>
      </div>
      <div className="simple-footer-right">
        <a href="#">PRIVACY</a>
        <a href="#">TERMS</a>
        <a href="#">CONTACT</a>
      </div>
    </footer>
  );
};

export default SimpleFooter;
