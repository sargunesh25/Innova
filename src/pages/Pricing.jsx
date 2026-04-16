import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';
import './WorkflowPages.css';

const Pricing = () => {
  const [audience, setAudience] = useState('companies');
  const [contact, setContact] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('');

  const handleContact = async (event) => {
    event.preventDefault();
    setStatus('');
    try {
      await api.post('/api/contact/sales', contact);
      setStatus('Sales request sent.');
      setContact({ name: '', email: '', message: '' });
    } catch (err) {
      setStatus(err.message);
    }
  };

  const companyPlans = [
    { title: 'Starter', cta: '/join?role=company', label: 'Get started' },
    { title: 'Growth', cta: '/join?role=company&plan=growth', label: 'Subscribe' },
    { title: 'Enterprise', cta: null, label: 'Contact sales' },
  ];
  const contributorPlans = [
    { title: 'Free', cta: '/join?role=solver', label: 'Get started' },
    { title: 'Premium', cta: '/join?role=solver&plan=premium', label: 'Upgrade' },
  ];

  return (
    <div className="workflow-page container">
      <div className="workflow-header">
        <h1 className="workflow-title">Pricing</h1>
        <p className="workflow-subtitle">Static pricing content with routing and sales contact wired to the backend.</p>
      </div>

      <div className="workflow-tabs" style={{ justifyContent: 'center', marginBottom: '2rem' }}>
        <button className={audience === 'companies' ? 'active' : ''} onClick={() => setAudience('companies')}>For Companies</button>
        <button className={audience === 'contributors' ? 'active' : ''} onClick={() => setAudience('contributors')}>For Contributors</button>
      </div>

      <div className="workflow-grid">
        <div className="workflow-stack">
          {(audience === 'companies' ? companyPlans : contributorPlans).map((plan) => (
            <div key={plan.title} className="workflow-card">
              <h2>{plan.title}</h2>
              <p>Uses the current visual style while preserving the pricing workflow in the spec.</p>
              <div className="workflow-actions" style={{ marginTop: '1rem' }}>
                {plan.cta ? <Link className="primary-btn" to={plan.cta}>{plan.label}</Link> : null}
                {!plan.cta ? <a className="primary-btn" href="#sales-form">{plan.label}</a> : null}
              </div>
            </div>
          ))}
        </div>

        <div className="workflow-stack">
          <div className="workflow-card" id="sales-form">
            <h3>Enterprise contact</h3>
            {status ? <div className={`workflow-banner ${status.includes('sent') ? '' : 'error'}`}>{status}</div> : null}
            <form className="workflow-form" onSubmit={handleContact}>
              <label>NAME<input value={contact.name} onChange={(event) => setContact((prev) => ({ ...prev, name: event.target.value }))} required /></label>
              <label>EMAIL<input type="email" value={contact.email} onChange={(event) => setContact((prev) => ({ ...prev, email: event.target.value }))} required /></label>
              <label>MESSAGE<textarea value={contact.message} onChange={(event) => setContact((prev) => ({ ...prev, message: event.target.value }))} required /></label>
              <button type="submit" className="primary-btn">Send</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
