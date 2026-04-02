import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell } from 'lucide-react';
import NotificationPanel from './NotificationPanel';
import './LoggedInNavbar.css';

const LoggedInNavbar = () => {
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  return (
    <>
    <header className="navbar-wrapper">
      <nav className="navbar container">
        <div className="nav-logo">
          <Link to="/">Innova</Link>
        </div>
        <ul className="nav-links">
          <li><Link to="/discover">Discover</Link></li>
          <li><Link to="/archive">Archive</Link></li>
          <li><Link to="/laboratory">Laboratory</Link></li>
          <li><Link to="/about">About</Link></li>
        </ul>
        <div className="nav-actions">
          <button className="icon-btn" aria-label="Notifications" onClick={() => setIsNotifOpen(true)}>
            <Bell size={20} />
          </button>
          <Link to="/profile" className="user-avatar-btn">
            {/* Using a placeholder avatar image or robust colored div */}
            <div className="avatar-placeholder">
               <img src="/julian_avatar.png" alt="Arjun Avatar" className="avatar-image" />
            </div>
          </Link>
        </div>
      </nav>
    </header>
    <NotificationPanel isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
    </>
  );
};

export default LoggedInNavbar;
