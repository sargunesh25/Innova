import React from 'react';
import './About.css';

const copy = {
  terms: {
    title: 'Terms of Service',
    subtitle: 'The operating rules for challenge participation, submissions, and reward flows.',
    body: [
      'These terms route is now live so the original UI no longer sends users to placeholder links. Final legal copy can replace this page without changing navigation or auth flows.',
      'Use of Innova is subject to account verification, challenge-specific rules, submission integrity requirements, and any prize, IP, or confidentiality conditions published with each challenge.',
    ],
  },
  privacy: {
    title: 'Privacy Policy',
    subtitle: 'How account, challenge, and notification data is handled across the platform.',
    body: [
      'This privacy route is active so the restored frontend has working legal navigation. It can later be replaced with your full approved policy text.',
      'Innova may process account information, profile data, notification preferences, challenge activity, and submission metadata to operate the product experience and backend workflows.',
    ],
  },
};

const Legal = ({ type = 'terms' }) => {
  const content = copy[type] || copy.terms;

  return (
    <div className="about-page container">
      <div className="about-header">
        <h1 className="page-title">{content.title}</h1>
        <p className="page-subtitle">{content.subtitle}</p>
      </div>

      <div className="about-content">
        {content.body.map((paragraph, index) => (
          <section key={index} className="about-section">
            <p className="section-text">{paragraph}</p>
          </section>
        ))}
      </div>
    </div>
  );
};

export default Legal;
