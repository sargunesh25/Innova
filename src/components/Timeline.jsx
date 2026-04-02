import React from 'react';
import './Timeline.css';

const Timeline = () => {
  const steps = [
    {
      number: 1,
      title: "Define",
      description: "Structure your technical roadblock into a clear brief.",
      active: true
    },
    {
      number: 2,
      title: "Publish",
      description: "Broadcast to our curated network of 180+ solvers.",
      active: false
    },
    {
      number: 3,
      title: "Collaborate",
      description: "Review submissions and iterate with experts.",
      active: false
    },
    {
      number: 4,
      title: "Deploy",
      description: "Unlock IP and scale your solution globally.",
      active: false
    }
  ];

  return (
    <section className="timeline container">
      <h2 className="timeline-title">From Problem to Solution</h2>
      
      <div className="timeline-track-container">
        <div className="timeline-line"></div>
        <div className="timeline-steps">
          {steps.map((step, index) => (
            <div key={index} className="timeline-step">
              <div className={`step-circle ${step.active ? 'active' : ''}`}>
                {step.number}
              </div>
              <h3 className="step-title">{step.title}</h3>
              <p className="step-description">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Timeline;
