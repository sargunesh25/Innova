import React from 'react';
import { Lightbulb, ShieldCheck, Compass } from 'lucide-react';
import './Features.css';

const Features = () => {
  const features = [
    {
      icon: <Lightbulb size={20} className="feature-icon" />,
      title: "Unfiltered Brilliance",
      description: "Access a global pool of researchers, engineers, and visionaries without the overhead of traditional hiring."
    },
    {
      icon: <ShieldCheck size={20} className="feature-icon" />,
      title: "IP Governance",
      description: "Our smart contracts ensure automated intellectual property transfer and secure reward distribution upon milestone completion."
    },
    {
      icon: <Compass size={20} className="feature-icon" />,
      title: "Modular Pipelines",
      description: "Break down complex R&D projects into bite-sized challenges that can be solved in parallel across different time zones."
    }
  ];

  return (
    <section className="features">
      <div className="container">
        <div className="features-header">
          <div className="features-intro">
            <h2 className="section-title">A new protocol for<br />intellectual discovery.</h2>
            <p className="section-subtitle">
              We replace bureaucracy with meritocracy, allowing the best ideas to<br />
              surface regardless of their origin.
            </p>
          </div>
          <a href="#" className="view-features-link">View all features</a>
        </div>
        
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="icon-wrapper">
                {feature.icon}
              </div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
