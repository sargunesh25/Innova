import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bell } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();
  const path = location.pathname;

  return (
    <header className="navbar-wrapper">
      <nav className="navbar container">
        <div className="nav-logo">
          <Link to="/">Innova</Link>
        </div>
        <ul className="nav-links">
        <li><Link to="/" className={path === '/' ? 'active' : ''}>Discover</Link></li>
        <li><a href="#">Archive</a></li>
        <li><Link to="/challenges" className={path.startsWith('/challenge') ? 'active' : ''}>Challenges</Link></li>
        <li><Link to="/about" className={path === '/about' ? 'active' : ''}>About</Link></li>
      </ul>
      <div className="nav-actions">
        <Link to="/login" className="login-btn text-btn">Sign in</Link>
        <Link to="/join" className="primary-btn">Join free</Link>
      </div>
    </nav>
    </header>
  );
};

export default Navbar;
