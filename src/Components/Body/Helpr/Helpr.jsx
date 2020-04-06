import React from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import './helpr.css';

const Helpr = () => {
  // SET INITIAL STATES
  const dispatch = useDispatch();

  return (
    <section className='helpr' id='becomeAHelpr'>
      <div className='content container'>
        <header>
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
        </header>
        <div className='cards'>
          <div className='card spring'>
            <div className='cardsection cardicon'>
              <img src='/imgs/icoPlantr.jpg' />
            </div>
            <div className='cardsection'>
              Spring has sprung and it's planting season. Hire a helpr and get the job done in a fraction of the time.
            </div>
            <div className='cardprices'>
              <p>Avg. Rate: $15-$20/sqft</p>
              <p>Service Fee: 15%</p>
            </div>
            <div className='cardsection'>
              <Link
                to={{ pathname: '/sign-up', state: { helprType: 'plantr' } }}
                className='button plantr main'
                onClick={() => dispatch({ type: 'isHelpr', payload: true })}
              >
                Become A <span className='lower'>plantr</span>
              </Link>
            </div>
          </div>

          <div className='card summer'>
            <div className='cardsection cardicon'>
              <img src='/imgs/icoMowr.jpg' />
            </div>
            <div className='cardsection'>
              Summer sun makes the grass grow greener... and taller. Hire a helpr to keep it beautifully manicured for
              you.
            </div>
            <div className='cardprices'>
              <p>Avg. Rate: $5-$10/sqft</p>
              <p>Service Fee: 15%</p>
            </div>
            <div className='cardsection'>
              <Link
                to={{ pathname: '/sign-up', state: { helprType: 'mowr' } }}
                className='button mowr main'
                onClick={() => dispatch({ type: 'isHelpr', payload: true })}
              >
                Become A <span className='lower'>mowr</span>
              </Link>
            </div>
          </div>

          <div className='card fall'>
            <div className='cardsection cardicon'>
              <img src='/imgs/icoRakr.jpg' />
            </div>
            <div className='cardsection'>
              Fall turns the leaves a beautiful color, but makes a big mess. Save your back and hire a helpr to do the
              raking.
            </div>
            <div className='cardprices'>
              <p>Avg. Rate: $2-$8/sqft</p>
              <p>Service Fee: 15%</p>
            </div>
            <div className='cardsection'>
              <Link
                to={{ pathname: '/sign-up', state: { helprType: 'rakr' } }}
                className='button rakr main'
                onClick={() => dispatch({ type: 'isHelpr', payload: true })}
              >
                Become A <span className='lower'>rakr</span>
              </Link>
            </div>
          </div>

          <div className='card winter'>
            <div className='cardsection cardicon'>
              <img src='/imgs/icoPlowr.jpg' />
            </div>
            <div className='cardsection'>
              Winter is a wonderland until the city plows in your driveway. Put down the shovel and hire a helpr
              instead.
            </div>
            <div className='cardprices'>
              <p>Avg. Rate: $20-$25/sqft</p>
              <p>Service Fee: 15%</p>
            </div>
            <div className='cardsection'>
              <Link
                to={{ pathname: '/sign-up', state: { helprType: 'plowr' } }}
                className='button plowr main'
                onClick={() => dispatch({ type: 'isHelpr', payload: true })}
              >
                Become A <span className='lower'>plowr</span>
              </Link>
            </div>
          </div>
        </div>

        <div className='cta'>
          <Link
            to={{ pathname: '/sign-up', state: { helprType: undefined } }}
            className='button alt'
            onClick={() => dispatch({ type: 'isHelpr', payload: true })}
          >
            Become A <span className='lower'>helpr</span> Today
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Helpr;
