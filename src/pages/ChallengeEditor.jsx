import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../lib/api';
import './WorkflowPages.css';

const ChallengeEditor = ({ mode = 'create' }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [step, setStep] = useState(1);
  const [slugStatus, setSlugStatus] = useState('');
  const [form, setForm] = useState({
    title: '',
    slug: '',
    summary: '',
    prize_pool: '',
    phase1_start_at: '',
    phase2_end_at: '',
    criteria: [
      { title: 'Impact', weight: 50 },
      { title: 'Execution', weight: 50 },
    ],
  });

  useEffect(() => {
    if (mode !== 'edit' || !id) return;
    api.get(`/api/challenges/${id}`).then((data) => setForm((prev) => ({ ...prev, ...data, criteria: data.criteria || prev.criteria })));
  }, [id, mode]);

  useEffect(() => {
    if (!form.slug) return;
    const timer = window.setTimeout(() => {
      api.get(`/api/challenges/check-slug?slug=${encodeURIComponent(form.slug)}`)
        .then((data) => setSlugStatus(data?.available ? 'Slug available' : 'Slug unavailable'))
        .catch(() => setSlugStatus('Slug check unavailable'));
    }, 500);
    return () => window.clearTimeout(timer);
  }, [form.slug]);

  const submit = async () => {
    if (mode === 'edit') {
      await api.patch(`/api/challenges/${id}`, form);
      navigate(`/challenges/${id}/manage`);
      return;
    }
    const created = await api.post('/api/challenges', form);
    if (created?.escrow_account_id) {
      await api.post(`/api/escrow/${created.escrow_account_id}/confirm-deposit`, { challenge_id: created.challenge_id || created.id });
    }
    navigate(`/challenges/${created.challenge_id || created.id}/manage`);
  };

  return (
    <div className="workflow-page container">
      <div className="workflow-header">
        <h1 className="workflow-title">{mode === 'edit' ? 'Edit challenge' : 'Post new challenge'}</h1>
        <p className="workflow-subtitle">A missing route added in the existing design language and connected to backend challenge endpoints.</p>
      </div>

      <div className="workflow-card" style={{ maxWidth: 860, margin: '0 auto' }}>
        <div className="workflow-tabs" style={{ marginBottom: '1rem' }}>
          {[1, 2, 3, 4].map((item) => <button key={item} className={step === item ? 'active' : ''} onClick={() => setStep(item)}>Step {item}</button>)}
        </div>

        {step === 1 ? (
          <div className="workflow-form">
            <label>TITLE<input value={form.title} onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value, slug: event.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') }))} /></label>
            <label>SLUG<input value={form.slug} onChange={(event) => setForm((prev) => ({ ...prev, slug: event.target.value }))} /></label>
            {slugStatus ? <div className="workflow-banner">{slugStatus}</div> : null}
            <label>SUMMARY<textarea value={form.summary} onChange={(event) => setForm((prev) => ({ ...prev, summary: event.target.value }))} /></label>
          </div>
        ) : null}

        {step === 2 ? (
          <div className="workflow-form">
            {form.criteria.map((item, index) => (
              <div key={index} className="workflow-inline">
                <input value={item.title} onChange={(event) => setForm((prev) => ({ ...prev, criteria: prev.criteria.map((row, rowIndex) => rowIndex === index ? { ...row, title: event.target.value } : row) }))} />
                <input type="number" value={item.weight} onChange={(event) => setForm((prev) => ({ ...prev, criteria: prev.criteria.map((row, rowIndex) => rowIndex === index ? { ...row, weight: Number(event.target.value) } : row) }))} />
              </div>
            ))}
          </div>
        ) : null}

        {step === 3 ? (
          <div className="workflow-form">
            <label>PHASE 1 START<input type="date" value={form.phase1_start_at?.slice(0, 10) || ''} onChange={(event) => setForm((prev) => ({ ...prev, phase1_start_at: event.target.value }))} /></label>
            <label>PHASE 2 END<input type="date" value={form.phase2_end_at?.slice(0, 10) || ''} onChange={(event) => setForm((prev) => ({ ...prev, phase2_end_at: event.target.value }))} /></label>
            <label>PRIZE POOL<input type="number" value={form.prize_pool} onChange={(event) => setForm((prev) => ({ ...prev, prize_pool: event.target.value }))} /></label>
          </div>
        ) : null}

        {step === 4 ? (
          <div className="workflow-code">{JSON.stringify(form, null, 2)}</div>
        ) : null}

        <div className="workflow-actions" style={{ marginTop: '1.5rem' }}>
          {step > 1 ? <button className="text-btn" onClick={() => setStep((prev) => prev - 1)}>Back</button> : null}
          {step < 4 ? <button className="primary-btn" onClick={() => setStep((prev) => prev + 1)}>Next</button> : <button className="primary-btn" onClick={submit}>{mode === 'edit' ? 'Save changes' : 'Pay now'}</button>}
        </div>
      </div>
    </div>
  );
};

export default ChallengeEditor;
