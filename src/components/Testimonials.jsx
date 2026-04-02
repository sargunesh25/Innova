import React from 'react';
import './Testimonials.css';

const Testimonials = () => {
  const testimonials = [
    {
      quote: "\"Innova allowed us to solve a materials science bottleneck that our in-house team had been struggling with for six months—in just three weeks.\"",
      author: "Dr. Aria Thorne",
      title: "Chief Scientist, AeroCore",
      avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
      theme: "light"
    },
    {
      quote: "\"The platform's focus on technical precision attracts the right talent. We don't just get ideas, we get validated, deployable code.\"",
      author: "Marcus Vane",
      title: "VP of Innovation, UblamX",
      avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
      theme: "dark"
    }
  ];

  return (
    <section className="testimonials container">
      <div className="testimonials-grid">
        {testimonials.map((testimonial, index) => (
          <div key={index} className={`testimonial-card ${testimonial.theme}`}>
            <p className="testimonial-quote">{testimonial.quote}</p>
            <div className="testimonial-author">
              <img src={testimonial.avatar} alt={testimonial.author} className="author-avatar" />
              <div className="author-info">
                <h4 className="author-name">{testimonial.author}</h4>
                <p className="author-title">{testimonial.title}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;
