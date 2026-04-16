import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import './WorkflowPages.css';

const Settings = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [settings, setSettings] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [deleteWord, setDeleteWord] = useState('');

  useEffect(() => {
    Promise.all([
      api.get('/api/users/me/settings'),
      api.get('/api/users/me/subscription').catch(() => null),
    ]).then(([settingsData, subscriptionData]) => {
      setSettings(settingsData);
      setSubscription(subscriptionData);
    });
  }, []);

  if (!settings) {
    return <div className="workflow-page container"><div className="workflow-card">Loading settings...</div></div>;
  }

  return (
    <div className="workflow-page container">
      <div className="workflow-header">
        <h1 className="workflow-title">Settings</h1>
        <p className="workflow-subtitle">Account, notifications, billing, and deletion in the existing UI style.</p>
      </div>

      <div className="workflow-grid">
        <div className="workflow-stack">
          <div className="workflow-card">
            <h2>Account</h2>
            <div className="workflow-form">
              <label>NAME<input value={settings.name || ''} onChange={(event) => setSettings((prev) => ({ ...prev, name: event.target.value }))} /></label>
              <label>EMAIL<input value={settings.email || ''} onChange={(event) => setSettings((prev) => ({ ...prev, email: event.target.value }))} /></label>
              <button className="primary-btn" onClick={() => api.patch('/api/users/me/account', { name: settings.name, email: settings.email })}>Save</button>
            </div>
          </div>
          <div className="workflow-card">
            <h2>Notification preferences</h2>
            <div className="workflow-form">
              {Object.entries(settings.notification_preferences || {}).map(([key, value]) => (
                <label key={key} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>{key}</span>
                  <input
                    type="checkbox"
                    checked={Boolean(value)}
                    onChange={(event) => {
                      const next = { ...(settings.notification_preferences || {}), [key]: event.target.checked };
                      setSettings((prev) => ({ ...prev, notification_preferences: next }));
                      api.patch('/api/users/me/notification-preferences', next);
                    }}
                    style={{ width: 'auto' }}
                  />
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="workflow-stack">
          <div className="workflow-card">
            <h3>Billing</h3>
            <p>{subscription?.plan_name || 'No subscription data available.'}</p>
            <div className="workflow-actions" style={{ marginTop: '1rem' }}>
              <button className="primary-btn" onClick={() => navigate('/pricing')}>Upgrade plan</button>
              <button className="text-btn" onClick={() => api.post('/api/users/me/subscription/cancel', {})}>Cancel subscription</button>
            </div>
          </div>
          <div className="workflow-card">
            <h3>Delete account</h3>
            <div className="workflow-form">
              <label>TYPE DELETE<input value={deleteWord} onChange={(event) => setDeleteWord(event.target.value)} /></label>
              <button
                className="primary-btn"
                disabled={deleteWord !== 'DELETE'}
                onClick={async () => {
                  await api.del('/api/users/me');
                  await logout();
                  navigate('/');
                }}
              >
                Delete account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
