import React from 'react';
import { Globe, Asterisk } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer container">
      <div className="footer-top">
        <div className="footer-brand">
          <h2 className="footer-logo">Innova</h2>
          <p className="footer-description">
            The global standard for open innovation and intellectual asset liquidity.
          </p>
          <div className="footer-icons">
            <Globe size={20} />
            <Asterisk size={20} />
          </div>
        </div>
        
        <div className="footer-links-grid">
          <div className="footer-column">
            <h4 className="column-title">PLATFORM</h4>
            <ul className="footer-links">
              <li><a href="#">Challenges</a></li>
              <li><a href="#">Solvers</a></li>
              <li><a href="#">Enterprise</a></li>
            </ul>
          </div>
          
          <div className="footer-column">
            <h4 className="column-title">COMPANY</h4>
            <ul className="footer-links">
              <li><a href="#">About</a></li>
              <li><a href="#">Journal</a></li>
              <li><a href="#">Careers</a></li>
            </ul>
          </div>
          
          <div className="footer-column">
            <h4 className="column-title">LEGAL</h4>
            <ul className="footer-links">
              <li><a href="#">Privacy</a></li>
              <li><a href="#">Terms</a></li>
              <li><a href="#">Editorial Policy</a></li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p className="copyright">&copy; 2024 Innova Manuscript. All rights reserved.</p>
        <div className="social-links">
          <a href="#">Twitter</a>
          <a href="#">LinkedIn</a>
          <a href="#">Discord</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
