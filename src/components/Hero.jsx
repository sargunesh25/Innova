import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Hero.css';

const Hero = () => {
  return (
    <section className="hero">
      <div className="container">
        <div className="hero-content">
          <div className="badge">OPEN INNOVATION PLATFORM</div>
        <h1 className="hero-title">
          Where companies bring real<br />
          problems, <em>the world solves them.</em>
        </h1>
        <div className="hero-actions">
          <Link to="/challenges" className="primary-btn hero-btn">Browse open challenges</Link>
          <Link to="/join?role=company" className="outline-btn hero-btn">
            Post a challenge <ArrowRight size={16} className="btn-icon" />
          </Link>
        </div>
        </div>
        <div className="hero-background-effects">
          <div className="gradient-blob"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
