import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Bell, LogOut, User } from 'lucide-react';
import NotificationPanel from './NotificationPanel';
import { useAuth } from '../context/AuthContext';
import { useDashboardInfo } from '../context/DashboardContext';
import './LoggedInNavbar.css';

const LoggedInNavbar = () => {
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;
  const { logout, userRole, user } = useAuth();
  const { unreadCount } = useDashboardInfo();
  const dropdownRef = useRef(null);

  const avatarUrl = user?.avatarUrl || null;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
    <header className="navbar-wrapper">
      <nav className="navbar container">
        <div className="nav-logo">
          <Link to="/dashboard">Innova</Link>
        </div>
        <ul className="nav-links">
          <li><Link to="/dashboard" className={path === '/dashboard' ? 'active' : ''}>Dashboard</Link></li>
          {userRole !== 'company' && (
            <li><Link to="/challenges" className={path.startsWith('/challenge') ? 'active' : ''}>Challenges</Link></li>
          )}
          <li><Link to="/laboratory" className={path === '/laboratory' ? 'active' : ''}>Laboratory</Link></li>
          <li><Link to="/about" className={path === '/about' ? 'active' : ''}>About</Link></li>
        </ul>
        <div className="nav-actions">
          <button className="icon-btn bell-btn" aria-label="Notifications" onClick={() => setIsNotifOpen(true)}>
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="notif-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
            )}
          </button>
          <div className="user-dropdown-container" ref={dropdownRef}>
            <button className="user-avatar-btn" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
              <div className="avatar-placeholder">
                {avatarUrl
                  ? <img src={avatarUrl} alt="User Avatar" className="avatar-image" />
                  : <User size={18} color="var(--text-secondary)" />
                }
              </div>
            </button>
            {isDropdownOpen && (
              <div className="user-dropdown-menu">
                <Link to="/profile" className="dropdown-item" onClick={() => setIsDropdownOpen(false)}>
                  <User size={16} /> My Profile
                </Link>
                <button className="dropdown-item logout-item" onClick={handleLogout}>
                  <LogOut size={16} /> Log out
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
    <NotificationPanel isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
    </>
  );
};

export default LoggedInNavbar;
