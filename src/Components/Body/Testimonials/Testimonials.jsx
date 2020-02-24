import React, { useEffect } from 'react';
import './testimonials.css';
import 'swiper/css/swiper.min.css';
import Swiper from 'swiper';

const Testimonials = props => {
  useEffect(() => {
    new Swiper('.swiper-container', {
      spaceBetween: 30,
      centeredSlides: true,
      autoplay: {
        delay: 3500,
        disableOnInteraction: false
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev'
      }
    }),
      [];
  });

  return (
    <section className='testimonials' id='testimonials'>
      <div className='content container'>
        <div className='header white'>
          <h1>Here's What Our Users Have to Save</h1>
          <div className='subheader white'>
            <span className='italic'>All services</span> offered through helpr are{' '}
            <span className='bold'>100% guaranteed</span> or your <span className='underline'>money back</span>.
          </div>
        </div>
        {/* SWIPER CONTAINER */}
        <div className='swiper-container'>
          {/* SWIPER WRAPPER */}
          <div className='swiper-wrapper'>
            {/* SWIPER SLIDES */}
            <div className='swiper-slide'>TESTIMONIAL 1</div>
            <div className='swiper-slide'>TESTIMONIAL 2</div>
            <div className='swiper-slide'>TESTIMONIAL 3</div>
          </div>
          {/* SWIPER PAGINATION */}
          <div className='swiper-pagination'></div>

          {/* SWIPER NAV */}
          <div className='swiper-button-prev'></div>
          <div className='swiper-button-next'></div>

          {/* SWIPER SCROLLBAR
        <div className='swiper-scrollbar'></div> */}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
