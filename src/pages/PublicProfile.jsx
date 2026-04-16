import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../lib/api';
import './WorkflowPages.css';

const PublicProfile = () => {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [ipars, setIpars] = useState([]);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    Promise.all([
      api.get(`/api/profile/${username}`),
      api.get(`/api/profile/${username}/ipar-records?page=1&limit=10`).catch(() => []),
      api.get(`/api/profile/${username}/challenge-history?page=1&limit=10`).catch(() => []),
    ]).then(([profileData, iparData, historyData]) => {
      setProfile(profileData);
      setIpars(iparData?.items || iparData || []);
      setHistory(historyData?.items || historyData || []);
    });
  }, [username]);

  if (!profile) {
    return <div className="workflow-page container"><div className="workflow-card">Loading public profile...</div></div>;
  }

  return (
    <div className="workflow-page container">
      <div className="workflow-header">
        <h1 className="workflow-title">{profile.name || profile.username}</h1>
        <p className="workflow-subtitle">{profile.title || 'Contributor profile'} {profile.location ? `· ${profile.location}` : ''}</p>
      </div>

      <div className="workflow-grid">
        <div className="workflow-stack">
          <div className="workflow-card">
            <h2>Profile</h2>
            <div className="workflow-code">{JSON.stringify({ skills: profile.skills, reputation: profile.reputation, endorsements: profile.endorsements }, null, 2)}</div>
          </div>
          <div className="workflow-card">
            <h2>Challenge history</h2>
            <div className="workflow-list">
              {history.map((item) => (
                <div key={item.id} className="workflow-item">
                  <div>
                    <div className="workflow-item-title">{item.challenge_name || item.title}</div>
                    <div className="workflow-item-meta">{item.status || 'History item'}</div>
                  </div>
                  <Link to={`/challenge/${item.challenge_id}`}>Open</Link>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="workflow-stack">
          <div className="workflow-card">
            <h3>IPAR records</h3>
            <div className="workflow-list">
              {ipars.map((item) => (
                <div key={item.id} className="workflow-item">
                  <div>
                    <div className="workflow-item-title">{item.title || item.id}</div>
                    <div className="workflow-item-meta">{item.created_at ? new Date(item.created_at).toLocaleDateString() : 'Verified record'}</div>
                  </div>
                  <Link to={`/profile/ipar/${item.id}`}>Verify</Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicProfile;
