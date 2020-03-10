import React from 'react';
import { useHistory } from 'react-router-dom';
import { HashLink as Link } from 'react-router-hash-link';
import { useForm } from 'react-hook-form';
import './hero.css';

const Hero = props => {
  const { register, handleSubmit, errors } = useForm();
  const history = useHistory();

  // HANDLE FORM SUBMISSION
  const onSubmit = data => {
    const path = { pathname: '/hire-a-helpr', state: { helprLocation: data.location } };
    console.log('path:', path);
    history.push(path);
  };

  // ERROR MESSAGES
  console.log('form errors:', errors);
  const required = 'This field is required.';

  //ERROR HANDLER
  const errorMessage = error => {
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
              >
                <option value='DEFAULT' disabled>
                  Select location
                </option>
                <option value='all'>All</option>
                <option value='northShore'>North Shore</option>
                <option value='southShore'>South Shore</option>
                <option value='laval'>Laval</option>
                <option value='montreal'>Montreal</option>
                <option value='longueuil'>Longueuil</option>
              </select>
              {errors.location && errors.location.type === 'required' && errorMessage(required)}

              <button className='button tertiary'>
                Find A <span className='lower'>helpr</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
