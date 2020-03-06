import React from 'react';
import './body.css';
import Hero from './Hero/Hero.jsx';
import Helpr from './Helpr/Helpr.jsx';
import Testimonials from './Testimonials/Testimonials.jsx';

const Body = props => {
  return (
    <div className='main wrapper' id='top'>
      <Hero />
      <Helpr />
      <Testimonials />
    </div>
  );
};

export default Body;
