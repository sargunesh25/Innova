import React, { useState, useMemo } from 'react';
import { ArrowRight } from 'lucide-react';
import { useDashboardInfo } from '../context/DashboardContext';
import './NotificationPanel.css';

const NotificationPanel = ({ isOpen, onClose }) => {
  const { notifications, markAllNotificationsRead } = useDashboardInfo();
  const [activeFilter, setActiveFilter] = useState('ALL');

  const filters = ['ALL', 'MENTIONS', 'PRIZES', 'PHASE'];

  const filteredNotifications = useMemo(() => {
    if (activeFilter === 'ALL') return notifications;
    const typeMap = { 'MENTIONS': 'mention', 'PRIZES': 'prize', 'PHASE': 'phase' };
    return notifications.filter(n => n.type === typeMap[activeFilter]);
  }, [notifications, activeFilter]);

  const handleMarkAllRead = () => {
    markAllNotificationsRead();
  };

  return (
    <>
      {/* Dim Overlay */}
      <div 
        className={`notif-overlay ${isOpen ? 'open' : ''}`} 
        onClick={onClose}
        aria-hidden="true"
      ></div>

      {/* Slide-out Drawer */}
      <div className={`notif-drawer ${isOpen ? 'open' : ''}`}>
        
        <div className="notif-header">
          <h2>Notifications</h2>
          <button className="mark-read-btn" onClick={handleMarkAllRead}>MARK ALL READ</button>
        </div>

        <div className="notif-filters">
          {filters.map(f => (
            <button
              key={f}
              className={`filter-pill ${activeFilter === f ? 'active' : ''}`}
              onClick={() => setActiveFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="notif-content-scroll">
          {filteredNotifications.length > 0 ? filteredNotifications.map(notif => (
            <div key={notif.id} className={`notif-card ${notif.cardStyle}`} style={{ opacity: notif.read ? 0.6 : 1 }}>
              <div className={`notif-dot ${notif.dotColor}`}></div>
              <div className="notif-card-content">
                <p dangerouslySetInnerHTML={{ __html: notif.text }}></p>
                <div className="notif-card-footer">
                  <span className="notif-time">{notif.time}</span>
                  {notif.actionLabel && (
                    <button className={`notif-action-btn ${notif.actionStyle}`}>
                      {notif.actionLabel} <ArrowRight size={12} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          )) : (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
              <p>No notifications in this category.</p>
            </div>
          )}
        </div>

      </div>
    </>
  );
};

export default NotificationPanel;
