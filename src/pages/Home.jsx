import React from 'react';
import Hero from '../components/Hero';
import Features from '../components/Features';
import Timeline from '../components/Timeline';
import Partners from '../components/Partners';
import Testimonials from '../components/Testimonials';

const Home = () => {
  return (
    <>
      <Hero />
      <Features />
      <Timeline />
      <div className="partners-testimonials">
        <Partners />
        <Testimonials />
      </div>
    </>
  );
};

export default Home;
