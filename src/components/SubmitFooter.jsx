import React from 'react';
import './SubmitFooter.css';

const SubmitFooter = () => {
  return (
    <footer className="submit-footer">
      <div className="submit-footer-container container">
        <div className="submit-footer-content">
          <div className="submit-footer-left">
            <h3 className="submit-footer-logo">Innova Manuscript</h3>
            <p className="submit-footer-tagline">The archived collective intelligence of a curious species.</p>
          </div>
          <div className="submit-footer-right">
            <a href="#">PRIVACY</a>
            <a href="#">TERMS</a>
            <a href="#">EDITORIAL POLICY</a>
            <a href="#">CONTACT</a>
          </div>
        </div>
        <div className="submit-footer-bottom">
          <p>&copy; 2024 Innova Manuscript. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default SubmitFooter;
