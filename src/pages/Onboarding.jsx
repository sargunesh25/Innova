import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api, withQuery } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import './WorkflowPages.css';

const Onboarding = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [step, setStep] = useState(1);
  const [discipline, setDiscipline] = useState(user?.primary_discipline || 'Engineering');
  const [skillQuery, setSkillQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [skills, setSkills] = useState([]);
  const [recommended, setRecommended] = useState(null);
  const [avatar, setAvatar] = useState(null);

  useEffect(() => {
    if (!skillQuery.trim()) return;
    const timer = window.setTimeout(() => {
      api.get(`/api/skills/suggestions?q=${encodeURIComponent(skillQuery)}`).then((data) => setSuggestions(data?.items || data || [])).catch(() => setSuggestions([]));
    }, 300);
    return () => window.clearTimeout(timer);
  }, [skillQuery]);

  useEffect(() => {
    if (user?.role !== 'solver') return;
    api.get(withQuery('/api/challenges', { recommended: true, discipline, limit: 1 }))
      .then((data) => setRecommended((data?.items || data || [])[0] || null))
      .catch(() => setRecommended(null));
  }, [discipline, user?.role]);

  const saveProfile = async () => {
    if (avatar) {
      const form = new FormData();
      form.append('avatar', avatar);
      await api.post('/api/users/avatar', form);
    }
    await api.patch('/api/users/profile', { skills, primary_discipline: discipline });
    updateUser({ skills, primary_discipline: discipline });
    setStep(2);
  };

  return (
    <div className="workflow-page container">
      <div className="workflow-header">
        <h1 className="workflow-title">Onboarding</h1>
        <p className="workflow-subtitle">A simple three-step flow using the current UI style and the backend profile endpoints.</p>
      </div>

      <div className="workflow-grid">
        <div className="workflow-stack">
          <div className="workflow-card">
            <h2>Step {step} of 3</h2>
            {step === 1 ? (
              <div className="workflow-form">
                <label>
                  AVATAR
                  <input type="file" onChange={(event) => setAvatar(event.target.files?.[0] || null)} />
                </label>
                <label>
                  PRIMARY DISCIPLINE
                  <select value={discipline} onChange={(event) => setDiscipline(event.target.value)}>
                    {['Engineering', 'Design', 'Research', 'Product'].map((item) => <option key={item}>{item}</option>)}
                  </select>
                </label>
                <label>
                  SKILLS
                  <input value={skillQuery} onChange={(event) => setSkillQuery(event.target.value)} placeholder="Search skills..." />
                </label>
                <div className="workflow-pills">
                  {suggestions.map((item) => (
                    <button key={item.id || item.name || item} type="button" className="workflow-pill" onClick={() => setSkills((prev) => prev.includes(item.name || item) ? prev : [...prev, item.name || item])}>
                      {item.name || item}
                    </button>
                  ))}
                </div>
                <div className="workflow-pills">
                  {skills.map((item) => (
                    <button key={item} type="button" className="workflow-pill active" onClick={() => setSkills((prev) => prev.filter((skill) => skill !== item))}>
                      {item}
                    </button>
                  ))}
                </div>
                <button className="primary-btn" type="button" onClick={saveProfile}>Next</button>
              </div>
            ) : null}
            {step === 2 ? (
              <div className="workflow-stack">
                <div className="workflow-banner">Your profile is saved. Continue to see a role-aware next step.</div>
                {user?.role === 'solver' && recommended ? (
                  <div className="workflow-card" style={{ padding: '1.25rem' }}>
                    <div className="workflow-item-title">{recommended.title}</div>
                    <div className="workflow-item-meta">Recommended from `GET /api/challenges?recommended=true...`</div>
                  </div>
                ) : null}
                <div className="workflow-actions">
                  <button className="primary-btn" onClick={() => setStep(3)}>Next</button>
                  <button className="text-btn" onClick={() => navigate('/dashboard')}>Skip, I&apos;ll explore</button>
                </div>
              </div>
            ) : null}
            {step === 3 ? (
              <div className="workflow-actions">
                {user?.role === 'company'
                  ? <Link to="/challenges/new" className="primary-btn">Post your first challenge</Link>
                  : <Link to={recommended ? `/challenge/${recommended.id}` : '/challenges'} className="primary-btn">Browse your first challenge</Link>}
                <Link to="/profile" className="text-btn">Complete your profile</Link>
              </div>
            ) : null}
          </div>
        </div>

        <div className="workflow-stack">
          <div className="workflow-card">
            <h3>Progress</h3>
            <div className="workflow-metrics">
              <div className="workflow-metric"><span>Step</span><strong>{step}/3</strong></div>
              <div className="workflow-metric"><span>Role</span><strong>{user?.role === 'company' ? 'Poster' : 'Contributor'}</strong></div>
              <div className="workflow-metric"><span>Skills</span><strong>{skills.length}</strong></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
