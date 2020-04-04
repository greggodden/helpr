import React, { useEffect } from 'react';
import './testimonials.css';
import 'swiper/css/swiper.min.css';
import Swiper from 'swiper';

const Testimonials = () => {
  useEffect(() => {
    new Swiper('.swiper-container', {
      spaceBetween: 30,
      centeredSlides: true,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
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
                  "This is the greatest website of all time! You can totally trust my honest and impartial review."
                </div>
                <div>
                  <img src='/imgs/notJordan.jpg' className='testimonial-image' />
                </div>
                <div>
                  <span className='italic'>
                    Definitely <span className='bold underline'>NOT</span> Jordan
                  </span>{' '}
                  from <span className='bold'>Montreal</span>
                </div>
              </div>
            </div>
            <div className='swiper-slide'>
              <div className='testimonial'>
                <div className='testimonial-content'>
                  "Maintaining my sprawling estate and many elaborate hedge mazes used to be a big time investment, but
                  not anymore. Thanks helpr!"
                </div>
                <div>
                  <img src='/imgs/notBryce.jpg' className='testimonial-image' />
                </div>
                <div>
                  <span className='italic'>
                    Probably <span className='bold underline'>NOT</span> Bryce
                  </span>{' '}
                  from <span className='bold'>Montreal</span>
                </div>
              </div>
            </div>
            <div className='swiper-slide'>
              <div className='testimonial'>
                <div className='testimonial-content'>"Choosey moms choose Angie's List... fools! I choose helpr!"</div>
                <div>
                  <img src='/imgs/notMatthieu.jpg' className='testimonial-image' />
                </div>
                <div>
                  <span className='italic'>
                    <span className='underline'>Maybe</span> Matthieu
                  </span>{' '}
                  from <span className='bold'>Montreal</span>
                </div>
              </div>
            </div>
          </div>
          {/* SWIPER PAGINATION */}
          <div className='swiper-pagination'></div>

          {/* SWIPER NAV */}
          <div className='swiper-button-prev'></div>
          <div className='swiper-button-next'></div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
