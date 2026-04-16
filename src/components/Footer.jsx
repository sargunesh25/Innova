import React from 'react';
import { Link } from 'react-router-dom';
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
              <li><Link to="/challenges">Challenges</Link></li>
              <li><Link to="/join">Solvers</Link></li>
              <li><Link to="/join?role=company">Enterprise</Link></li>
            </ul>
          </div>
          
          <div className="footer-column">
            <h4 className="column-title">COMPANY</h4>
            <ul className="footer-links">
              <li><Link to="/about">About</Link></li>
              <li><Link to="/dashboard">Journal</Link></li>
              <li><Link to="/join">Careers</Link></li>
            </ul>
          </div>
          
          <div className="footer-column">
            <h4 className="column-title">LEGAL</h4>
            <ul className="footer-links">
              <li><Link to="/privacy">Privacy</Link></li>
              <li><Link to="/terms">Terms</Link></li>
              <li><Link to="/privacy">Editorial Policy</Link></li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p className="copyright">&copy; 2024 Innova Manuscript. All rights reserved.</p>
        <div className="social-links">
          <a href="https://twitter.com" target="_blank" rel="noreferrer">Twitter</a>
          <a href="https://linkedin.com" target="_blank" rel="noreferrer">LinkedIn</a>
          <a href="https://discord.com" target="_blank" rel="noreferrer">Discord</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
