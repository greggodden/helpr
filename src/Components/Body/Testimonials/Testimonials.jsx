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
        delay: 4500,
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
        <header>
          <h1>Here's What Our Users Have to Say</h1>
          <div className='subheader'>
            <span className='italic'>All services</span> offered through helpr are{' '}
            <span className='bold'>100% guaranteed</span> or your <span className='underline'>money back</span>.
          </div>
        </header>
        {/* SWIPER CONTAINER */}
        <div className='swiper-container'>
          {/* SWIPER WRAPPER */}
          <div className='swiper-wrapper'>
            {/* SWIPER SLIDES */}
            <div className='swiper-slide'>
              <div className='testimonial'>
                <div className='testimonial-content'>
                  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore
                  et dolore magna aliqua."
                </div>
                <div>
                  <img src='/imgs/man1.jpg' className='testimonial-image' />
                </div>
                <div>
                  <span className='italic'>Bob</span> from <span className='bold'>Montreal</span>
                </div>
              </div>
            </div>
            <div className='swiper-slide'>
              <div className='testimonial'>
                <div className='testimonial-content'>
                  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore
                  et dolore magna aliqua."
                </div>
                <div>
                  <img src='/imgs/woman1.jpg' className='testimonial-image' />
                </div>
                <div>
                  <span className='italic'>Bob</span> from <span className='bold'>Montreal</span>
                </div>
              </div>
            </div>
            <div className='swiper-slide'>
              <div className='testimonial'>
                <div className='testimonial-content'>
                  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore
                  et dolore magna aliqua."
                </div>
                <div>
                  <img src='/imgs/woman2.jpg' className='testimonial-image' />
                </div>
                <div>
                  <span className='italic'>Bob</span> from <span className='bold'>Montreal</span>
                </div>
              </div>
            </div>
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
