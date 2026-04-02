import React from 'react';
import './About.css';

const About = () => {
  return (
    <div className="about-page container">
      <div className="about-header">
        <h1 className="page-title">About Innova</h1>
        <p className="page-subtitle">Bridging the gap between real-world problems and brilliant minds.</p>
      </div>
      
      <div className="about-content">
        <section className="about-section">
          <h2 className="section-title">What we do</h2>
          <p className="section-text">
            At Innova, we provide an open innovation platform where forward-thinking companies 
            can pose complex, real-world technical and design challenges. We then connect these 
            problems with a global community of diverse, brilliant problem solvers, researchers, 
            and engineers. From climate tech to cutting-edge AI, we host sealed-phase competitions 
            that prioritize unbiased, pure merit-based solutions.
          </p>
        </section>

        <section className="about-section">
          <h2 className="section-title">Why us?</h2>
          <p className="section-text">
            We believe that the world's most difficult puzzles don't always have solutions neatly tucked inside corporate laboratories. 
            By democratizing problem-solving, our platform creates a win-win scenario: 
            companies gain access to unorthodox, breakthrough ideas rapidly, while talented individuals 
            have the opportunity to showcase their skills, win substantial prizes, and directly impact the future.
          </p>
        </section>
      </div>
    </div>
  );
};

export default About;
