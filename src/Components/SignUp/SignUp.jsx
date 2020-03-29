import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useHistory } from 'react-router-dom';
import { AiOutlineCheckCircle, AiOutlineUserAdd, AiOutlineWarning } from 'react-icons/ai';
import { Snackbar, CircularProgress } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import './signup.css';

const Alert = props => {
  return <MuiAlert elevation={6} variant='filled' {...props} />;
};

const SignUp = () => {
  // SET INITIAL STATES
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(state => state.isLoggedIn);
  const isHelpr = useSelector(state => state.isHelpr);
  const [serviceLocations, setServiceLocations] = useState([]);
  const [serviceTypes, setServiceTypes] = useState([]);
  const [open, setOpen] = useState(false);
  const [alertType, setAlertType] = useState('');
  const [alertMsg, setAlertMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();
  const location = useLocation();

  // COMPONENT DID MOUNT
  useEffect(() => {
    if (isLoggedIn) {
      toggleAlert('You cannot create a new account while logged in.', 'warning');
      return;
    }

    const type = location.state ? location.state.helprType : '';

    setServiceTypes(serviceTypes => serviceTypes.concat(type));
  }, []);

  // ADD OR REMOVE SERVICE LOCATIONS TO ARRAY
  const handleLocChecked = e => {
    const locName = e.target.name;

    // REMOVE LOCATION
    if (!e.target.checked && serviceLocations.includes(locName)) {
      setServiceLocations(serviceLocations => serviceLocations.filter(loc => loc !== locName));
      return;
    }

    // ADD LOCATION
    if (e.target.checked && !serviceLocations.includes(locName)) {
      setServiceLocations(serviceLocations => serviceLocations.concat(locName));
      return;
    }
  };

  // ADD OR REMOVE SERVICE TYPES TO ARRAY
  const handleTypeChecked = e => {
    const typeName = e.target.name;

    // REMOVE SERVICE TYPE
    if (!e.target.checked && serviceTypes.includes(typeName)) {
      setServiceTypes(serviceTypes => serviceTypes.filter(name => name !== typeName));
      return;
    }

    // ADD SERVICE TYPE
    if (e.target.checked && !serviceTypes.includes(typeName)) {
      setServiceTypes(serviceTypes => serviceTypes.concat(typeName));
      return;
    }
  };

  // CLOSE ALERT
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    if (isHelpr && alertType === 'success') {
      setOpen(false);
      history.push('/view-bookings');
    }
    if (!isHelpr && alertType === 'success') {
      setOpen(false);
      history.push('/hire-a-helpr');
    }
    if (alertType === 'error' || alertType === 'warning') {
      setOpen(false);
      return;
    }

    setOpen(false);
  };

  // TOGGLE ALERT
  const toggleAlert = (msg, type) => {
    setAlertType(type);
    setAlertMsg(msg);
    setOpen(true);
  };

  // HANDLE BUTTON TEXT
  const getBtnText = () => {
    if (!isLoading) {
      return (
        <>
          <AiOutlineCheckCircle /> Sign-Up
        </>
      );
    }
    return <CircularProgress variant='indeterminate' size='1rem' />;
  };

  // FORM HANDLER
  const { register, handleSubmit, errors, watch } = useForm();
  const onSubmit = async field => {
    if (isHelpr) {
      setIsLoading(true);

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
      data.append('serviceLocations', serviceLocations);
      data.append('serviceTypes', serviceTypes);
      const response = await fetch('/sign-up', { method: 'POST', body: data });
      let body = await response.text();
      body = JSON.parse(body);

      setIsLoading(false);

      if (!body.success) {
        console.log('sign-up failed.');
        toggleAlert(body.message, 'error');
        return;
      }

      console.log('sign-up successful.');
      dispatch({ type: 'signup-success' });
      dispatch({ type: 'userId', payload: body.id });
      toggleAlert(body.message, 'success');
      return;
    }

    setIsLoading(true);

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
    const response = await fetch('/sign-up', { method: 'POST', body: data });
    let body = await response.text();
    body = JSON.parse(body);

    setIsLoading(false);

    if (!body.success) {
      console.log('sign-up failed.');
      toggleAlert(body.message, 'error');
      return;
    }

    console.log('sign-up successful.');
    dispatch({ type: 'signup-success' });
    dispatch({ type: 'userId', payload: body.id });
    toggleAlert(body.message, 'success');
    return;
  };

  // FORM ERROR MESSAGES
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
              autoFocus={true}
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
              <option value='North Shore'>North Shore</option>
              <option value='South Shore'>South Shore</option>
              <option value='Laval'>Laval</option>
              <option value='Montreal'>Montreal</option>
              <option value='Longueuil'>Longueuil</option>
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
                    id='userplantr'
                    ref={register}
                    onChange={e => handleTypeChecked(e)}
                  />
                  <label htmlFor='userplantr'>plantr</label>
                </div>
                <div className='pill mowr'>
                  <input
                    type='checkbox'
                    placeholder='mowr'
                    name='mowr'
                    id='usermowr'
                    ref={register}
                    onChange={e => handleTypeChecked(e)}
                  />
                  <label htmlFor='usermowr'>mowr</label>
                </div>
                <div className='pill rakr'>
                  <input
                    type='checkbox'
                    placeholder='rakr'
                    name='rakr'
                    id='userrakr'
                    ref={register}
                    onChange={e => handleTypeChecked(e)}
                  />
                  <label htmlFor='userrakr'>rakr</label>
                </div>
                <div className='pill plowr'>
                  <input
                    type='checkbox'
                    placeholder='plowr'
                    name='plowr'
                    id='userplowr'
                    ref={register}
                    onChange={e => handleTypeChecked(e)}
                  />
                  <label htmlFor='userplowr'>plowr</label>
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
                    name='North Shore'
                    id='northShore'
                    ref={register}
                    onChange={e => handleLocChecked(e)}
                  />
                  <label htmlFor='northShore'>North Shore</label>
                </div>
                <div className='pill'>
                  <input
                    type='checkbox'
                    placeholder='southShore'
                    name='South Shore'
                    id='southShore'
                    ref={register}
                    onChange={e => handleLocChecked(e)}
                  />
                  <label htmlFor='southShore'>South Shore</label>
                </div>
                <div className='pill'>
                  <input
                    type='checkbox'
                    placeholder='Laval'
                    name='Laval'
                    id='laval'
                    ref={register}
                    onChange={e => handleLocChecked(e)}
                  />
                  <label htmlFor='laval'>Laval</label>
                </div>
                <div className='pill'>
                  <input
                    type='checkbox'
                    placeholder='montreal'
                    name='Montreal'
                    id='montreal'
                    ref={register}
                    onChange={e => handleLocChecked(e)}
                  />
                  <label htmlFor='montreal'>Montreal</label>
                </div>
                <div className='pill'>
                  <input
                    type='checkbox'
                    placeholder='longueuil'
                    name='Longueuil'
                    id='longueuil'
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
                    id='plantr'
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
                    id='mowr'
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
                    id='rakr'
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
                    id='plowr'
                    ref={register}
                    checked={serviceTypes.includes('plowr') && 'checked'}
                    onChange={e => handleTypeChecked(e)}
                  />
                  <label htmlFor='plowr'>plowr</label>
                </div>
              </div>
            </div>

            <button className='button primary' type='submit'>
              {getBtnText()}
            </button>
          </form>

          <div>
            Already have an account? <Link to='/login'>Login</Link>.
          </div>

          <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
            <Alert onClose={handleClose} severity={alertType}>
              {alertMsg}
            </Alert>
          </Snackbar>
        </div>
      </div>
    </section>
  );
};

export default SignUp;
