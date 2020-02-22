import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './body.css';
import 'swiper/css/swiper.min.css';
import Swiper from 'swiper';

const Body = props => {
  useEffect(() => {
    new Swiper('.swiper-container', {
      spaceBetween: 30,
      centeredSlides: true,
      autoplay: {
        delay: 2500,
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
    <div className='main wrapper'>
      <section className='hero'>
        <div className='content'>
          <div className='promo'>
            <div className='promoBlock'>
              <h1>
                Become A help<span className='r'>r</span>
              </h1>
              <div className='promoContent'>
                If you've got the tools, we've got the customers. Sign-up to become a helpr today and start earning
                money when you lend a helping hand.
              </div>
              <div>
                <Link to={'/#becomeAHelpr'} className='button primary'>
                  Become A Helpr
                </Link>
              </div>
            </div>
          </div>
          <div className='promo'>
            <div className='promoBlock'>
              <h1>
                Hire A help<span className='r'>r</span>
              </h1>
              <div className='promoContent'>
                Need a helping hand? You've come to the right place. Find a helpr in your area today.
              </div>
              <div>
                <form>
                  <select id='helprLocation'>
                    <option defaultValue disabled>
                      Select a location
                    </option>
                    <option value=''>All</option>
                    <option value=''>North Shore</option>
                    <option value=''>South Shore</option>
                    <option value=''>Laval</option>
                    <option value=''>Montreal</option>
                    <option value=''>Longueuil</option>
                  </select>
                  <button className='button secondary'>Find A helpr</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className='helpr' id='becomeAHelpr'>
        <div className='content'>I CAN BE YOUR HELPR, BABY</div>
      </section>
      <section className='testimonials'>
        <div className='content'>
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
    </div>
  );
};

export default Body;
