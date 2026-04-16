import React, { useEffect, useMemo, useState } from 'react';
import { api } from '../lib/api';
import './WorkflowPages.css';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    api.get('/api/notifications?page=1&limit=30').then((data) => setNotifications(data?.items || data || []));
  }, []);

  const filtered = useMemo(() => {
    if (filter === 'All') return notifications;
    if (filter === 'Challenges') return notifications.filter((n) => String(n.type || '').includes('challenge'));
    if (filter === 'Prizes') return notifications.filter((n) => ['prize_distributed', 'payment_confirmed'].includes(n.type));
    if (filter === 'Collaboration') return notifications.filter((n) => n.type === 'collaboration_activity');
    return notifications.filter((n) => n.type === 'system');
  }, [filter, notifications]);

  const markAll = async () => {
    await api.patch('/api/notifications/read-all', {});
    setNotifications((prev) => prev.map((item) => ({ ...item, read: true })));
  };

  const openNotification = async (item) => {
    await api.patch(`/api/notifications/${item.id}/read`, {});
    if (item.action_url) {
      window.location.href = item.action_url;
    }
  };

  return (
    <div className="workflow-page container">
      <div className="workflow-header">
        <h1 className="workflow-title">Notifications</h1>
        <p className="workflow-subtitle">A full page notification view using the same card language as the rest of the existing app.</p>
      </div>

      <div className="workflow-card">
        <div className="workflow-actions" style={{ justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div className="workflow-tabs">
            {['All', 'Challenges', 'Prizes', 'Collaboration', 'System'].map((item) => (
              <button key={item} className={filter === item ? 'active' : ''} onClick={() => setFilter(item)}>{item}</button>
            ))}
          </div>
          <button className="text-btn" onClick={markAll}>Mark all read</button>
        </div>
        <div className="workflow-list">
          {filtered.map((item) => (
            <button key={item.id} className="workflow-item" onClick={() => openNotification(item)} style={{ background: 'transparent', textAlign: 'left' }}>
              <div>
                <div className="workflow-item-title">{item.message || item.type}</div>
                <div className="workflow-item-meta">{item.created_at ? new Date(item.created_at).toLocaleString() : 'Now'}</div>
              </div>
              <div className="workflow-item-meta">{item.read ? 'Read' : 'Unread'}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
