import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { useLocation, useHistory } from 'react-router-dom';
import { AiOutlineSetting, AiOutlineCheckCircle } from 'react-icons/ai';
import { Snackbar, CircularProgress } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import './settings.css';

const Alert = props => {
  return <MuiAlert elevation={6} variant='filled' {...props} />;
};

const Settings = () => {
  // SET INITIAL STATES
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(state => state.isLoggedIn);
  const isHelpr = useSelector(state => state.isHelpr);
  const userId = useSelector(state => state.userId);
  const [serviceLocations, setServiceLocations] = useState([]);
  const [serviceTypes, setServiceTypes] = useState([]);
  const [serviceRates, setServiceRates] = useState([]);
  const [helprData, setHelprData] = useState();
  const [open, setOpen] = useState(false);
  const [alertType, setAlertType] = useState('');
  const [alertMsg, setAlertMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();
  const location = useLocation();

  // ON COMPONENT DID MOUNT
  useEffect(() => {
    getData(userId);
  }, []);

  // ADD OR REMOVE SERVICE TYPES TO ARRAY
  const handleTypeChecked = e => {
    const typeName = e.target.name;

    // REMOVE SERVICE TYPE
    if (!e.target.checked && serviceTypes.includes(typeName)) {
      setServiceTypes(serviceTypes => serviceTypes.filter(name => name !== typeName));
      console.log('type removed: ', typeName);
      return;
    }

    // ADD SERVICE TYPE
    if (e.target.checked && !serviceTypes.includes(typeName)) {
      setServiceTypes(serviceTypes => serviceTypes.concat(typeName));
      console.log('type added: ', typeName);
      return;
    }
  };

  // ADD OR REMOVE SERVICE RATES
  const handleRateChange = e => {
    const rateName = e.target.name;
    const rateValue = e.target.value;
  };

  // ADD OR REMOVE SERVICE LOCATIONS TO ARRAY
  const handleLocChecked = e => {
    const locName = e.target.name;

    // REMOVE LOCATION
    if (!e.target.checked && serviceLocations.includes(locName)) {
      setServiceLocations(serviceLocations => serviceLocations.filter(loc => loc !== locName));
      console.log('location removed: ', locName);
      return;
    }

    // ADD LOCATION
    if (e.target.checked && !serviceLocations.includes(locName)) {
      setServiceLocations(serviceLocations => serviceLocations.concat(locName));
      console.log('location added: ', locName);
      return;
    }
  };

  // RETRIEVE HELPR DATA
  const getData = async isHelpr => {
    const data = new FormData();
    data.append('isHelpr', isHelpr);
    data.append('_id', userId);

    try {
      const response = await fetch('/getData', { method: 'POST', body: data });
      let body = await response.text();
      body = JSON.parse(body);
      const profile = body.payload;
      console.log('helpr Profile: ', profile);

      if (body.success === false) {
        console.log(body.message);
        return;
      }

      setHelprData(profile);
      setServiceTypes(profile.serviceTypes);
      setServiceRates(profile.serviceRates);
      console.log('plantr rate:', serviceRates.plantr);
      setServiceLocations(profile.serviceLocations);
    } catch (err) {
      console.log('error in getData', err);
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
      history.push('/settings');
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
          <AiOutlineCheckCircle /> Save Settings
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
      data.append('rate', 15.0);
      data.append('rating', 0);
      data.append('profileImg', '');
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

  // ERROR HANDLER
  const errorMessage = error => {
    return (
      <div className='error'>
        <AiOutlineWarning /> {error}
      </div>
    );
  };

  return (
    <>
      {/* {!isLoggedIn && history.push('/login')}
      {!isHelpr && history.push('/')} */}
      <section className='settings'>
        <div className='content container'>
          <div className='formWrapper'>
            <div className='settingsIcon'>
              <AiOutlineSetting />
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div>
                <h1>Service Types</h1>
              </div>
              <div className='subheader'>What types of services do you offer?</div>
              <div className='pills'>
                <div className='pill plantr'>
                  <input
                    type='checkbox'
                    placeholder='plantr'
                    name='plantr'
                    id='plantr'
                    autoFocus={true}
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

              <hr />

              <div>
                <h1>Service Rates</h1>
              </div>
              <div className='subheader'>How much do you charge for your services?</div>
              <div className='pills'>
                <div className='pill plantr'>
                  $
                  <input
                    type='text'
                    placeholder='0'
                    name='plantrRate'
                    id='plantrRate'
                    className='secondaryInput'
                    ref={register}
                    value={serviceRates.plantr}
                    // value={serviceRates.find(rate => {
                    //   return rate.plantr;
                    // })}
                    onChange={e => handleRateChange(e)}
                  />
                  /sqft
                </div>
                <div className='pill mowr'>
                  $
                  <input
                    type='text'
                    placeholder='0'
                    name='mowrRate'
                    id='mowrRate'
                    className='secondaryInput'
                    ref={register}
                    value={serviceRates.mowr}
                    // value={serviceRates.find(rate => {
                    //   return rate.mowr;
                    // })}
                    onChange={e => handleRateChange(e)}
                  />
                  /sqft
                </div>
                <div className='pill rakr'>
                  $
                  <input
                    type='text'
                    placeholder='0'
                    name='rakrRate'
                    id='rakrRate'
                    className='secondaryInput'
                    ref={register}
                    value={serviceRates.rakr}
                    // value={serviceRates.find(rate => {
                    //   return rate.rakr;
                    // })}
                    onChange={e => handleRateChange(e)}
                  />
                  /sqft
                </div>
                <div className='pill plowr'>
                  $
                  <input
                    type='text'
                    placeholder='0'
                    name='plowrRate'
                    id='plowrRate'
                    className='secondaryInput'
                    ref={register}
                    value={serviceRates.plowr}
                    // value={serviceRates.find(rate => {
                    //   return rate.plowr;
                    // })}
                    onChange={e => handleRateChange(e)}
                  />
                  /sqft
                </div>
              </div>

              <hr />

              <div>
                <h1>Service Locations</h1>
              </div>
              <div className='subheader'>What locations do you offer your services in?</div>
              <div className='pills'>
                <div className='pill'>
                  <input
                    type='checkbox'
                    placeholder='North Shore'
                    name='North Shore'
                    id='northShore'
                    ref={register}
                    checked={serviceLocations.includes('North Shore') && 'checked'}
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
                    checked={serviceLocations.includes('South Shore') && 'checked'}
                    onChange={e => handleLocChecked(e)}
                  />
                  <label htmlFor='southShore'>South Shore</label>
                </div>
                <div className='pill'>
                  <input
                    type='checkbox'
                    placeholder='laval'
                    name='Laval'
                    id='laval'
                    ref={register}
                    checked={serviceLocations.includes('Laval') && 'checked'}
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
                    checked={serviceLocations.includes('Montreal') && 'checked'}
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
                    checked={serviceLocations.includes('Longueuil') && 'checked'}
                    onChange={e => handleLocChecked(e)}
                  />
                  <label htmlFor='longueuil'>Longueuil</label>
                </div>
              </div>
              <button className='button primary' type='submit'>
                {getBtnText()}
              </button>
            </form>

            <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
              <Alert onClose={handleClose} severity={alertType}>
                {alertMsg}
              </Alert>
            </Snackbar>
          </div>
        </div>
      </section>
    </>
  );
};

export default Settings;
