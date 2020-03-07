import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useLocation } from 'react-router-dom';
import { AiOutlineCheckCircle, AiOutlineUserAdd, AiOutlineWarning } from 'react-icons/ai';
import './signup.css';

const SignUp = () => {
  // USER STATE & TYPE
  const [isHelpr, setIsHelpr] = useState(false);
  const [helprType, setHelprType] = useState('');
  const location = useLocation();
  const helpr = location.state.helpr;
  const type = location.state.helprType;

  useEffect(() => {
    setIsHelpr(helpr);
    setHelprType(type);
  });

  // FORM HANDLERS
  const { register, handleSubmit, errors } = useForm();
  const onSubmit = data => console.log(data);
  console.log(errors);

  // ERROR MESSAGES
  const required = 'This field is required.';
  const minLength = 'Input does not meet minimum length requirement.';
  const maxLength = 'Input exeeds maximum length.';
  const pattern = 'Input format is not valid.';
  const pwdMinLength = 'Password must longer than 8 characters.';
  const pwdPattern = 'Passwords must include at least: 1 lowercase letter, 1 uppercase letter, and 1 number.';

  //ERROR HANDLER
  const errorMessage = error => {
    return (
      <div className='error'>
        <AiOutlineWarning /> {error}
      </div>
    );
  };

  return (
    <section className='signup'>
      <div className='content container'>
        <div className='formWrapper'>
          <div className='signupIcon'>
            <AiOutlineUserAdd />
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <input
              className='secondaryInput'
              type='text'
              placeholder='Email'
              name='email'
              ref={register({
                required: 'Email is a required field.',
                maxLength: 80,
                pattern: /^\S+@\S+$/i
              })}
            />
            {errors.email && errors.email.type === 'required' && errorMessage(required)}
            {errors.email && errors.email.type === 'maxLength' && errorMessage(maxLength)}
            {errors.email && errors.email.type === 'pattern' && errorMessage(pattern)}

            <input
              className='secondaryInput'
              type='text'
              placeholder='Password'
              name='password'
              ref={register({ required: true, minLength: 8, pattern: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,100}$/i })}
            />
            {errors.password && errors.password.type === 'required' && errorMessage(required)}
            {errors.password && errors.password.type === 'minLength' && errorMessage(pwdMinLength)}
            {errors.password && errors.password.type === 'pattern' && errorMessage(pwdPattern)}

            <input
              className='secondaryInput'
              type='text'
              placeholder='Confirm Password'
              name='confirmPassword'
              ref={register({ required: true, minLength: 8, pattern: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,100}$/i })}
            />
            {errors.password && errors.password.type === 'required' && errorMessage(required)}
            {errors.password && errors.password.type === 'minLength' && errorMessage(pwdMinLength)}
            {errors.password && errors.password.type === 'pattern' && errorMessage(pwdPattern)}

            <hr />

            <div className='formBox'>
              <div>
                <input
                  className='secondaryInput'
                  type='text'
                  placeholder='First name'
                  name='firstName'
                  ref={register({ required: true, maxLength: 40 })}
                />
                {errors.firstName && errors.firstName.type === 'required' && errorMessage(required)}
                {errors.firstName && errors.firstName.type === 'maxLength' && errorMessage(maxLength)}
              </div>
              <div>
                <input
                  className='secondaryInput'
                  type='text'
                  placeholder='Last name'
                  name='lastName'
                  ref={register({ required: true, maxLength: 40 })}
                />
                {errors.lastName && errors.lastName.type === 'required' && errorMessage(required)}
                {errors.lastName && errors.lastName.type === 'maxLength' && errorMessage(maxLength)}
              </div>
            </div>

            <input
              className='secondaryInput'
              type='tel'
              placeholder='Phone number'
              name='phoneNumber'
              ref={register({ required: true, minLength: 6, maxLength: 12 })}
            />
            {errors.phoneNumber && errors.phoneNumber.type === 'required' && errorMessage(required)}
            {errors.phoneNumber && errors.phoneNumber.type === 'minLength' && errorMessage(minLength)}
            {errors.phoneNumber && errors.phoneNumber.type === 'maxLength' && errorMessage(maxLength)}

            <input
              className='secondaryInput'
              type='text'
              placeholder='Address'
              name='address'
              ref={register({ required: true, maxLength: 100 })}
            />
            {errors.address && errors.address.type === 'required' && errorMessage(required)}
            {errors.address && errors.address.type === 'maxLength' && errorMessage(maxLength)}

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

            <input
              className='secondaryInput'
              type='text'
              placeholder='Postal Code'
              name='postalCode'
              ref={register({ required: true, maxLength: 7 })}
            />
            {errors.postalCode && errors.postalCode.type === 'required' && errorMessage(required)}
            {errors.postalCode && errors.postalCode.type === 'maxLength' && errorMessage(maxLength)}

            <hr />

            {/* SHOW TO USERS ONLY */}
            <div className={isHelpr ? 'hide' : ''}>
              <div>
                <h1>
                  Pick a help<span className='r'>r</span>
                </h1>
              </div>
              <div className='subheader'>What type of helpr do you need?</div>
              <div className='formHelprs subheader'>
                <div className='pill plantr'>
                  <input type='checkbox' placeholder='plantr' name='plantr' ref={register} />
                  <label htmlFor='plantr'>plantr</label>
                </div>
                <div className='pill mowr'>
                  <input type='checkbox' placeholder='mowr' name='mowr' ref={register} />
                  <label htmlFor='mowr'>mowr</label>
                </div>
                <div className='pill rakr'>
                  <input type='checkbox' placeholder='rakr' name='rakr' ref={register} />
                  <label htmlFor='rakr'>rakr</label>
                </div>
                <div className='pill plowr'>
                  <input type='checkbox' placeholder='plowr' name='plowr' ref={register} />
                  <label htmlFor='plowr'>plowr</label>
                </div>
              </div>
            </div>

            {/* SHOW TO HELPRS ONLY */}
            <div className={isHelpr ? '' : 'hide'}>
              <div>
                <h1>Service Locations</h1>
              </div>
              <div className='subheader'>Select the locations you offer services to.</div>
              <div className='formHelprs subheader'>
                <div className='pill'>
                  <input type='checkbox' placeholder='North Shore' name='nortShore' ref={register} />
                  <label htmlFor='northShore'>North Shore</label>
                </div>
                <div className='pill'>
                  <input type='checkbox' placeholder='southShore' name='southShore' ref={register} />
                  <label htmlFor='southShore'>South Shore</label>
                </div>
                <div className='pill'>
                  <input type='checkbox' placeholder='laval' name='laval' ref={register} />
                  <label htmlFor='laval'>Laval</label>
                </div>
                <div className='pill'>
                  <input type='checkbox' placeholder='montreal' name='montreal' ref={register} />
                  <label htmlFor='montreal'>Montreal</label>
                </div>
                <div className='pill'>
                  <input type='checkbox' placeholder='longueuil' name='longueuil' ref={register} />
                  <label htmlFor='longueuil'>Longueuil</label>
                </div>
              </div>
            </div>

            <div className={isHelpr ? '' : 'hide'}>
              <div>
                <h1>Service Types</h1>
              </div>
              <div className='subheader'>What type of helpr are you?</div>
              <div className='formHelprs subheader'>
                <div className='pill plantr'>
                  <input type='checkbox' placeholder='plantr' name='plantr' ref={register} />
                  <label htmlFor='plantr'>plantr</label>
                </div>
                <div className='pill mowr'>
                  <input type='checkbox' placeholder='mowr' name='mowr' ref={register} />
                  <label htmlFor='mowr'>mowr</label>
                </div>
                <div className='pill rakr'>
                  <input type='checkbox' placeholder='rakr' name='rakr' ref={register} />
                  <label htmlFor='rakr'>rakr</label>
                </div>
                <div className='pill plowr'>
                  <input type='checkbox' placeholder='plowr' name='plowr' ref={register} />
                  <label htmlFor='plowr'>plowr</label>
                </div>
              </div>
            </div>

            <button className='button primary' type='submit'>
              <AiOutlineCheckCircle />
              Sign-Up
            </button>
          </form>

          <div>
            Already have an account? <Link to='/login'>Login</Link>.
          </div>
        </div>
      </div>
    </section>
  );
};

export default SignUp;
