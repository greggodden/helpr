import React from 'react';
import { HashLink as Link } from 'react-router-hash-link';
import { useForm } from 'react-hook-form';
import './hero.css';

const Hero = props => {
  const { register, handleSubmit, errors } = useForm();
  const onSubmit = data => console.log(data);
  console.log('form errors:', errors);

  // ERROR MESSAGES
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
                <option value='North Shore'>North Shore</option>
                <option value='South Shore'>South Shore</option>
                <option value='Laval'>Laval</option>
                <option value='Montreal'>Montreal</option>
                <option value='Longueuil'>Longueuil</option>
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
