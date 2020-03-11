import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useHistory } from 'react-router-dom';
import { AiOutlineCheckCircle, AiOutlineUserAdd, AiOutlineWarning } from 'react-icons/ai';
import './signup.css';

const SignUp = () => {
  // SET INITIAL STATES
  const [isHelpr, setIsHelpr] = useState(false);
  const [helprType, setHelprType] = useState('');
  const [serviceLocations, setServiceLocations] = useState([]);
  const [serviceTypes, setServiceTypes] = useState([]);
  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    const helpr = location.state ? location.state.helpr : false;
    const type = location.state ? location.state.helprType : '';

    setIsHelpr(helpr);
    setHelprType(type);
    setServiceTypes(serviceTypes => serviceTypes.concat(type));
    console.log('effect service type added:', type);
    console.log('effect service types:', serviceTypes);
  }, []);

  // ADD OR REMOVE SERVICE LOCATIONS TO ARRAY
  const handleLocChecked = e => {
    const locName = e.target.name;
    console.log('handleLocStart:', serviceLocations);
    if (!e.target.checked && serviceLocations.includes(locName)) {
      setServiceLocations(serviceLocations => serviceLocations.filter(loc => loc !== locName));
      console.log('handleLocRemoved:', locName);
      return;
    }
    if (e.target.checked && !serviceLocations.includes(locName)) {
      setServiceLocations(serviceLocations => serviceLocations.concat(locName));
      console.log('handleLocAdded:', locName);
      return;
    }
  };

  // ADD OR REMOVE SERVICE TYPES TO ARRAY
  const handleTypeChecked = e => {
    const typeName = e.target.name;
    console.log('handleTypeStart:', serviceTypes);
    if (!e.target.checked && serviceTypes.includes(typeName)) {
      setServiceTypes(serviceTypes => serviceTypes.filter(name => name !== typeName));
      console.log('handleTypeRemoved:', typeName);
      return;
    }
    if (e.target.checked && !serviceTypes.includes(typeName)) {
      setServiceTypes(serviceTypes => serviceTypes.concat(typeName));
      console.log('handleTypeAdded:', typeName);
      return;
    }
  };

  // FORM HANDLER
  const { register, handleSubmit, errors, watch } = useForm();
  const onSubmit = async field => {
    if (isHelpr) {
      const data = new FormData();
      data.append('isHelpr', isHelpr);
      data.append('email', field.email);
      data.append('password', field.password);
      data.append('firstName', field.firstName);
      data.append('lastName', field.lastName);
      data.append('phoneNumber', field.phoneNumber);
      data.append('address', field.address);
      data.append('city', field.city);
      data.append('postalCode', field.postalCode);
      data.append('rate', 15.0);
      data.append('rating', 0);
      data.append('profileImg', '');
      data.append('serviceLocations', serviceLocations);
      data.append('serviceTypes', serviceTypes);
      console.log('helpr data:', data);
      const response = await fetch('/sign-up', { method: 'POST', body: data });
      let body = await response.text();
      body = JSON.parse(body);
      if (!body.success) {
        console.log('sign-up failed.');
        window.alert(body.message);
        return;
      }
      console.log('sign-up successful.');
      window.alert(body.message);
      history.push('/view-bookings');
      return;
    }
    const data = new FormData();
    data.append('isHelpr', isHelpr);
    data.append('email', field.email);
    data.append('password', field.password);
    data.append('firstName', field.firstName);
    data.append('lastName', field.lastName);
    data.append('phoneNumber', field.phoneNumber);
    data.append('address', field.address);
    data.append('city', field.city);
    data.append('postalCode', field.postalCode);
    data.append('serviceTypes', serviceTypes);
    console.log('helpr data:', data);
    const response = await fetch('/sign-up', { method: 'POST', body: data });
    let body = await response.text();
    body = JSON.parse(body);
    if (!body.success) {
      console.log('sign-up failed.');
      window.alert(body.message);
      return;
    }
    console.log('sign-up successful.');
    window.alert(body.message);
    history.push('/hire-a-helpr');
    return;
  };

  // FORM ERROR MESSAGES
  console.log('form errors:', errors);
  const required = 'This field is required.';
  const minLength = 'Input does not meet minimum length requirement.';
  const maxLength = 'Input exeeds maximum length.';
  const pattern = 'Input format is not valid.';
  const pwdMinLength = 'Password must longer than 8 characters.';
  const pwdPattern = 'Password must include: 1 lowercase letter, 1 uppercase letter, 1 number.';
  const pwdMatch = 'Passwords do not match.';

  // ERROR HANDLER
  const errorMessage = error => {
    return (
      <div className='error'>
        <AiOutlineWarning /> {error}
      </div>
    );
  };

  return (
    <section className='signup' id='top'>
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
                pattern: /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/i
              })}
            />
            {errors.email && errors.email.type === 'required' && errorMessage(required)}
            {errors.email && errors.email.type === 'maxLength' && errorMessage(maxLength)}
            {errors.email && errors.email.type === 'pattern' && errorMessage(pattern)}

            <input
              className='secondaryInput'
              type='password'
              placeholder='Password'
              name='password'
              ref={register({ required: true, minLength: 8, pattern: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,100}$/i })}
            />
            {errors.password && errors.password.type === 'required' && errorMessage(required)}
            {errors.password && errors.password.type === 'minLength' && errorMessage(pwdMinLength)}
            {errors.password && errors.password.type === 'pattern' && errorMessage(pwdPattern)}

            <input
              className='secondaryInput'
              type='password'
              placeholder='Confirm Password'
              name='confirmPassword'
              ref={register({ required: true, validate: value => value === watch('password') || pwdMatch })}
            />
            {errors.confirmPassword && errors.confirmPassword.type === 'required' && errorMessage(required)}
            {errors.confirmPassword && errors.confirmPassword.type === 'validate' && errorMessage(pwdMatch)}

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
              name='city'
              ref={register({ required: true, validate: value => value !== 'DEFAULT' || required })}
              defaultValue={'DEFAULT'}
            >
              <option value='DEFAULT' disabled>
                Select location
              </option>
              <option value='northShore'>North Shore</option>
              <option value='southShore'>South Shore</option>
              <option value='laval'>Laval</option>
              <option value='montreal'>Montreal</option>
              <option value='longueuil'>Longueuil</option>
            </select>
            {errors.city && errors.city.type === 'required' && errorMessage(required)}
            {errors.city && errors.city.type === 'validate' && errorMessage(required)}

            <input
              className='secondaryInput'
              type='text'
              placeholder='Postal Code'
              name='postalCode'
              ref={register({ required: true, minLength: 6, maxLength: 7 })}
            />
            {errors.postalCode && errors.postalCode.type === 'required' && errorMessage(required)}
            {errors.postalCode && errors.postalCode.type === 'minLength' && errorMessage(minLength)}
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
                  <input
                    type='checkbox'
                    placeholder='plantr'
                    name='plantr'
                    ref={register}
                    onChange={e => handleTypeChecked(e)}
                  />
                  <label htmlFor='plantr'>plantr</label>
                </div>
                <div className='pill mowr'>
                  <input
                    type='checkbox'
                    placeholder='mowr'
                    name='mowr'
                    ref={register}
                    onChange={e => handleTypeChecked(e)}
                  />
                  <label htmlFor='mowr'>mowr</label>
                </div>
                <div className='pill rakr'>
                  <input
                    type='checkbox'
                    placeholder='rakr'
                    name='rakr'
                    ref={register}
                    onChange={e => handleTypeChecked(e)}
                  />
                  <label htmlFor='rakr'>rakr</label>
                </div>
                <div className='pill plowr'>
                  <input
                    type='checkbox'
                    placeholder='plowr'
                    name='plowr'
                    ref={register}
                    onChange={e => handleTypeChecked(e)}
                  />
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
                  <input
                    type='checkbox'
                    placeholder='North Shore'
                    name='northShore'
                    ref={register}
                    onChange={e => handleLocChecked(e)}
                  />
                  <label htmlFor='northShore'>North Shore</label>
                </div>
                <div className='pill'>
                  <input
                    type='checkbox'
                    placeholder='southShore'
                    name='southShore'
                    ref={register}
                    onChange={e => handleLocChecked(e)}
                  />
                  <label htmlFor='southShore'>South Shore</label>
                </div>
                <div className='pill'>
                  <input
                    type='checkbox'
                    placeholder='laval'
                    name='laval'
                    ref={register}
                    onChange={e => handleLocChecked(e)}
                  />
                  <label htmlFor='laval'>Laval</label>
                </div>
                <div className='pill'>
                  <input
                    type='checkbox'
                    placeholder='montreal'
                    name='montreal'
                    ref={register}
                    onChange={e => handleLocChecked(e)}
                  />
                  <label htmlFor='montreal'>Montreal</label>
                </div>
                <div className='pill'>
                  <input
                    type='checkbox'
                    placeholder='longueuil'
                    name='longueuil'
                    ref={register}
                    onChange={e => handleLocChecked(e)}
                  />
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
                  <input
                    type='checkbox'
                    placeholder='plantr'
                    name='plantr'
                    ref={register}
                    checked={serviceTypes.includes('plantr') && 'checked'}
                    onChange={e => handleTypeChecked(e)}
                  />
                  <label htmlFor='plantr'>plantr</label>
                </div>
                <div className='pill mowr'>
                  <input
                    type='checkbox'
                    placeholder='mowr'
                    name='mowr'
                    ref={register}
                    checked={serviceTypes.includes('mowr') && 'checked'}
                    onChange={e => handleTypeChecked(e)}
                  />
                  <label htmlFor='mowr'>mowr</label>
                </div>
                <div className='pill rakr'>
                  <input
                    type='checkbox'
                    placeholder='rakr'
                    name='rakr'
                    ref={register}
                    checked={serviceTypes.includes('rakr') && 'checked'}
                    onChange={e => handleTypeChecked(e)}
                  />
                  <label htmlFor='rakr'>rakr</label>
                </div>
                <div className='pill plowr'>
                  <input
                    type='checkbox'
                    placeholder='plowr'
                    name='plowr'
                    ref={register}
                    checked={serviceTypes.includes('plowr') && 'checked'}
                    onChange={e => handleTypeChecked(e)}
                  />
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
