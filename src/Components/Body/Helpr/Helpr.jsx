import React from 'react';
import { Link } from 'react-router-dom';
import './helpr.css';

const Helpr = props => {
  return (
    <section className='helpr' id='becomeAHelpr'>
      <div className='content container'>
        <div className='header'>
          <h1>
            What Type Of help<span className='r'>r</span> Are You?
          </h1>
          <div className='subheader'>
            <span className='italic'>Spring, Summer, Fall, Winter</span> - no matter the season, there's always someone
            that <span className='underline'>needs a helping hand</span>.
          </div>
          <div className='subheader'>
            Select your area of expertise below and{' '}
            <span className='bold italic'>start making money as a helpr today!</span>
          </div>
        </div>
        <div className='cards'>
          <div className='card spring'>
            <div className='cardsection cardicon'>
              <img src='/imgs/icoPlantr.jpg' />
            </div>
            <div className='cardsection'>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
              dolore magna aliqua.
            </div>
            <div className='cardprices'>
              <p>Avg. Rate: $1-$10/sqft</p>
              <p>Service Fee: 15%</p>
            </div>
            <div className='cardsection'>
              <Link to={{ pathname: '/sign-up', state: { helprTypeClicked: 'plantr' } }} className='button plantr'>
                Become A <span className='lower'>plantr</span>
              </Link>
            </div>
          </div>
          <div className='card summer'>
            <div className='cardsection cardicon'>
              <img src='/imgs/icoMowr.jpg' />
            </div>
            <div className='cardsection'>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
              dolore magna aliqua.
            </div>
            <div className='cardprices'>
              <p>Avg. Rate: $1-$10/sqft</p>
              <p>Service Fee: 15%</p>
            </div>
            <div className='cardsection'>
              <Link to={{ pathname: '/sign-up', state: { helprTypeClicked: 'mowr' } }} className='button mowr'>
                Become A <span className='lower'>mowr</span>
              </Link>
            </div>
          </div>
          <div className='card fall'>
            <div className='cardsection cardicon'>
              <img src='/imgs/icoRakr.jpg' />
            </div>
            <div className='cardsection'>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
              dolore magna aliqua.
            </div>
            <div className='cardprices'>
              <p>Avg. Rate: $1-$10/sqft</p>
              <p>Service Fee: 15%</p>
            </div>
            <div className='cardsection'>
              <Link to={{ pathname: '/sign-up', state: { helprTypeClicked: 'rakr' } }} className='button rakr'>
                Become A <span className='lower'>rakr</span>
              </Link>
            </div>
          </div>
          <div className='card winter'>
            <div className='cardsection cardicon'>
              <img src='/imgs/icoPlowr.jpg' />
            </div>
            <div className='cardsection'>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
              dolore magna aliqua.
            </div>
            <div className='cardprices'>
              <p>Avg. Rate: $1-$10/sqft</p>
              <p>Service Fee: 15%</p>
            </div>
            <div className='cardsection'>
              <Link to={{ pathname: '/sign-up', state: { helprTypeClicked: 'plowr' } }} className='button plowr'>
                Become A <span className='lower'>plowr</span>
              </Link>
            </div>
          </div>
        </div>
        <div className='cta'>
          <Link to={'/sign-up'} className='button alt'>
            Become A <span className='lower'>helpr</span> Today
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Helpr;
