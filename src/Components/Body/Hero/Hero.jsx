import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { HashLink as Link } from 'react-router-hash-link';
import { useForm } from 'react-hook-form';
import { AiOutlineWarning } from 'react-icons/ai';
import './hero.css';

const Hero = () => {
  // SET INITIAL STATES
  const { register, handleSubmit, errors, setError, clearError } = useForm();
  const history = useHistory();
  const [inputLocation, setInputLocation] = useState();

  // ON COMPONENT DID MOUNTH
  useEffect(() => {
    setInputLocation('DEFAULT');
  }, []);

  // HANDLE FORM SUBMISSION
  const onSubmit = (data) => {
    clearError('required');

    if (inputLocation === 'DEFAULT' || !inputLocation) {
      setError('location', 'required', required);
      return;
    }

    const path = { pathname: '/hire-a-helpr', state: { helprLocation: data.location } };
    console.log('path push: ', path);
    history.push(path);
  };

  // HANDLE FORM CHANGES
  const onLocChange = (e) => {
    setInputLocation(e.target.value);
  };

  // ERROR MESSAGES
  const required = 'Please select a valid location.';

  //ERROR HANDLER
  const errorMessage = (error) => {
    return (
      <div className='error'>
        <AiOutlineWarning /> {error}
      </div>
    );
  };

  return (
    <section className='hero'>
      <div className='content'>
        <div className='promo'>
          <div className='promoBlock'>
            <h1>
              Become A help<span className='rHelpr'>r</span>
            </h1>
            <div className='promoContent'>
              If you've got the tools, we've got the customers. Sign-up to become a helpr today and start earning money
              when you lend a helping hand.
            </div>
            <div>
              <Link smooth to={'/#becomeAHelpr'} className='button primary'>
                Learn More
              </Link>
            </div>
          </div>
        </div>
        <div className='promo'>
          <div className='promoBlock'>
            <h1>
              Hire A help<span className='rUser'>r</span>
            </h1>
            <div className='promoContent'>
              Need a helping hand? You've come to the right place. Find a helpr in your area today.
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <select
                className='secondarySelect'
                name='location'
                ref={register({ required: true })}
                defaultValue={'DEFAULT'}
                onChange={(e) => onLocChange(e)}
              >
                <option value='DEFAULT' disabled>
                  Select location
                </option>
                <option value='All'>All</option>
                <option value='North Shore'>North Shore</option>
                <option value='South Shore'>South Shore</option>
                <option value='Laval'>Laval</option>
                <option value='Montreal'>Montreal</option>
                <option value='Longueuil'>Longueuil</option>
              </select>

              <button className='button tertiary'>
                Find A <span className='lower'>helpr</span>
              </button>

              {errors.location && errors.location.type === 'required' && errorMessage(required)}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
