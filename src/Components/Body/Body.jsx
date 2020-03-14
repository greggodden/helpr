import React from 'react';
import './body.css';
import Hero from './Hero/Hero.jsx';
import Helpr from './Helpr/Helpr.jsx';
import Testimonials from './Testimonials/Testimonials.jsx';

const Body = () => {
  return (
    <main className='wrapper' id='top'>
      <Hero />
      <Helpr />
      <Testimonials />
    </main>
  );
};

export default Body;
