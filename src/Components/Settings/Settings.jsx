import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import { AiOutlineSetting, AiOutlineCheckCircle, AiOutlineWarning } from 'react-icons/ai';
import { Snackbar, CircularProgress } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import './settings.css';

const Alert = (props) => {
  return <MuiAlert elevation={6} variant='filled' {...props} />;
};

const Settings = () => {
  // SET INITIAL STATES
  const isLoggedIn = useSelector((state) => state.isLoggedIn);
  const isHelpr = useSelector((state) => state.isHelpr);
  const userId = useSelector((state) => state.userId);
  const [serviceLocations, setServiceLocations] = useState([]);
  const [serviceTypes, setServiceTypes] = useState([]);
  const [profileImg, setProfileImg] = useState();
  const [previewImg, setPreviewImg] = useState();
  const [previewImgName, setPreviewImgName] = useState();
  const [disabledTypes, setDisabledTypes] = useState([]);
  const [plantrRate, setPlantrRate] = useState(0);
  const [mowrRate, setMowrRate] = useState(0);
  const [rakrRate, setRakrRate] = useState(0);
  const [plowrRate, setPlowrRate] = useState(0);
  const [open, setOpen] = useState(false);
  const [alertType, setAlertType] = useState('');
  const [alertMsg, setAlertMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();

  // ON COMPONENT DID MOUNT
  useEffect(() => {
    getData(userId);
  }, []);

  // CHECK IF TYPE IS DISABLED
  const isDisabled = (type) => {
    if (serviceTypes.includes(type)) return false;
    if (disabledTypes.includes(type)) return true;
    return false;
  };

  // ADD OR REMOVE SERVICE TYPES TO ARRAY
  const handleTypeChecked = (e) => {
    const type = e.target.name;

    // REMOVE SERVICE TYPE
    if (!e.target.checked && serviceTypes.includes(type)) {
      setServiceTypes((serviceTypes) => serviceTypes.filter((name) => name !== type));
      setDisabledTypes((disabledTypes) => disabledTypes.concat(type));
      changeRates(type, 0);
      return;
    }

    // ADD SERVICE TYPE
    if (e.target.checked && !serviceTypes.includes(type)) {
      setServiceTypes((serviceTypes) => serviceTypes.concat(type));
      setDisabledTypes((disabledTypes) => disabledTypes.filter((name) => name !== type));
      clearError('serviceType');
      return;
    }
  };

  // HANDLE SERVICE RATE CHANGES
  const changeRates = (type, value) => {
    if (type === 'plantr') return setPlantrRate(value);
    if (type === 'mowr') return setMowrRate(value);
    if (type === 'rakr') return setRakrRate(value);
    if (type === 'plowr') return setPlowrRate(value);
  };

  // HANDLE SERVICE RATE ENTRIES
  const handleRateChange = (e) => {
    clearError();
    const inputName = e.target.name.substring(0, e.target.name.length - 4);
    let inputValue = Number(e.target.value);
    if (isNaN(inputValue)) {
      inputValue = 0;
      return;
    }
    changeRates(inputName, inputValue);
  };

  // ADD OR REMOVE SERVICE LOCATIONS TO ARRAY
  const handleLocChecked = (e) => {
    const location = e.target.name;

    // REMOVE LOCATION
    if (!e.target.checked && serviceLocations.includes(location)) {
      setServiceLocations((serviceLocations) => serviceLocations.filter((loc) => loc !== location));
      return;
    }

    // ADD LOCATION
    if (e.target.checked && !serviceLocations.includes(location)) {
      setServiceLocations((serviceLocations) => serviceLocations.concat(location));
      clearError('serviceLocation');
      return;
    }
  };

  // HANDLE PROFILE IMG
  const handleProfileImg = (e) => {
    clearError('fileSize');
    setPreviewImg();
    setPreviewImgName();

    const imgFile = e.target.files[0];
    if (imgFile) {
      if (imgFile.size > 1000000) {
        setError('fileSize', 'fileSize', fileSize);
        setPreviewImg();
        setPreviewImgName();
        return;
      }

      const imgPreview = URL.createObjectURL(imgFile);
      const imgName = imgFile.name;
      setPreviewImg(imgPreview);
      setPreviewImgName(imgName);
      setProfileImg(imgFile);
      return;
    }

    return;
  };

  // RETRIEVE HELPR DATA
  const getData = async (isHelpr) => {
    const data = new FormData();
    data.append('isHelpr', isHelpr);
    data.append('_id', userId);

    try {
      const response = await fetch('/getData', { method: 'POST', body: data });
      let body = await response.text();
      body = JSON.parse(body);
      const profile = body.payload;

      if (body.success === false) {
        console.log(body.message);
        return;
      }

      // SET VALUES IN STATE
      const servRates = profile.serviceRates.map((rate) => {
        const servType = Object.getOwnPropertyNames(rate).toString();
        const servRate = rate[servType];
        changeRates(servType, Number(servRate));
      });
      const allTypes = ['plantr', 'mowr', 'rakr', 'plowr'];
      const disableTypes = allTypes.map((type) => {
        if (!profile.serviceTypes.includes(type)) {
          setDisabledTypes((disabledTypes) => disabledTypes.concat(type));
        }
      });
      setServiceTypes(profile.serviceTypes);
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
    if (alertType === 'error' || alertType === 'warning') {
      clearError();
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
  const { register, handleSubmit, errors, setError, clearError } = useForm();
  const onSubmit = async () => {
    setIsLoading(true);

    // SERVICE TYPE VALIDATION
    if (serviceTypes.length === 0) {
      setIsLoading(false);
      setError('serviceType', 'typeRequired', typeRequired);
      return;
    }

    // SERVICE LOCATION VALIDATION
    if (serviceLocations.length === 0) {
      setIsLoading(false);
      setError('serviceLocation', 'locationRequired', locationRequired);
      return;
    }

    // SERVICE RATE VALIDATION
    const ratesArr = [plantrRate, mowrRate, rakrRate, plowrRate];

    const mapped = ratesArr.filter((rate) => {
      const regex = RegExp(/(^\d+$)/i);
      if (rate > 25) {
        setIsLoading(false);
        setError('serviceRate', 'max', max);
        return 'max';
      }
      if (rate === undefined) {
        setIsLoading(false);
        setError('serviceRate', 'noRate', noRate);
        return 'noRate';
      }
      if (!regex.test(rate)) {
        setIsLoading(false);
        setError('serviceRate', 'pattern', pattern);
        return 'pattern';
      }
    });

    // PREVENT SUBMIT WITH RATE ERRORS OPEN
    if (mapped.length > 0) {
      setIsLoading(false);
      toggleAlert('Error saving settings.', 'warning');
      return;
    }

    const data = new FormData();
    data.append('_id', userId);
    data.append('serviceTypes', serviceTypes);
    data.append('plantrRate', plantrRate);
    data.append('mowrRate', mowrRate);
    data.append('rakrRate', rakrRate);
    data.append('plowrRate', plowrRate);
    data.append('serviceLocations', serviceLocations);
    data.append('profileImg', profileImg);

    try {
      const response = await fetch('/helprSettings', { method: 'POST', body: data });
      let body = await response.text();
      body = JSON.parse(body);

      setIsLoading(false);

      if (!body.success) {
        console.log('Saving settings returned error: ', body.message);
        setIsLoading(false);
        toggleAlert(body.message, 'error');
        return;
      }

      toggleAlert(body.message, 'success');
      return;
    } catch (err) {
      console.log('Error saving settings:', err);
      setIsLoading(false);
      toggleAlert('Error saving settings.', 'error');
      return;
    }
  };

  // FORM ERROR MESSAGES
  const max = 'Maximum service rate is: $25/sqft';
  const noRate = 'A service rate must be provided.';
  const pattern = 'Service rates can only contains numbers.';
  const typeRequired = 'Minimum 1 service type must be selected.';
  const locationRequired = 'Minimum 1 service location must be selected.';
  const fileSize = 'Profile images cannot exceed 1MB.';

  // ERROR HANDLER
  const errorMessage = (error) => {
    return (
      <div className='error'>
        <AiOutlineWarning /> {error}
      </div>
    );
  };

  return (
    <>
      {!isLoggedIn && history.push('/login')}
      {!isHelpr && history.push('/')}
      <section className='settings'>
        <div className='content container'>
          <div className='formWrapper'>
            <div className='settingsIcon'>
              <AiOutlineSetting />
            </div>
            <form onSubmit={handleSubmit(onSubmit)} encType='multipart/form-data'>
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
                    onChange={(e) => (e) => handleTypeChecked(e)}
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
                    onChange={(e) => handleTypeChecked(e)}
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
                    onChange={(e) => handleTypeChecked(e)}
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
                    onChange={(e) => handleTypeChecked(e)}
                  />
                  <label htmlFor='plowr'>plowr</label>
                </div>
              </div>

              {errors.serviceType && errorMessage(typeRequired)}

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
                    name='plantrRate'
                    id='plantrRate'
                    className='secondaryInput'
                    maxLength='2'
                    ref={register}
                    value={plantrRate}
                    disabled={isDisabled('plantr')}
                    onChange={(e) => (e) => handleRateChange(e)}
                  />
                  /sqft
                </div>
                <div className='pill mowr'>
                  $
                  <input
                    type='text'
                    name='mowrRate'
                    id='mowrRate'
                    className='secondaryInput'
                    maxLength='2'
                    ref={register}
                    value={mowrRate}
                    disabled={isDisabled('mowr')}
                    onChange={(e) => handleRateChange(e)}
                  />
                  /sqft
                </div>
                <div className='pill rakr'>
                  $
                  <input
                    type='text'
                    name='rakrRate'
                    id='rakrRate'
                    className='secondaryInput'
                    maxLength='2'
                    ref={register}
                    value={rakrRate}
                    disabled={isDisabled('rakr')}
                    onChange={(e) => handleRateChange(e)}
                  />
                  /sqft
                </div>
                <div className='pill plowr'>
                  $
                  <input
                    type='text'
                    name='plowrRate'
                    id='plowrRate'
                    className='secondaryInput'
                    maxLength='2'
                    ref={register}
                    value={plowrRate}
                    disabled={isDisabled('plowr')}
                    onChange={(e) => handleRateChange(e)}
                  />
                  /sqft
                </div>
              </div>

              {errors.serviceRate && errors.serviceRate.type === 'max' && errorMessage(max)}
              {errors.serviceRate && errors.serviceRate.type === 'noRate' && errorMessage(noRate)}
              {errors.serviceRate && errors.serviceRate.type === 'pattern' && errorMessage(pattern)}

              <hr />

              <div>
                <h1>Service Locations</h1>
              </div>
              <div className='subheader'>What locations do you offer your services in?</div>
              <div>
                <img src='imgs/gma_map.gif' alt='Service Locations Map' />
              </div>
              <div className='pills'>
                <div className='pill'>
                  <input
                    type='checkbox'
                    placeholder='North Shore'
                    name='North Shore'
                    id='northShore'
                    ref={register}
                    checked={serviceLocations.includes('North Shore') && 'checked'}
                    onChange={(e) => handleLocChecked(e)}
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
                    onChange={(e) => handleLocChecked(e)}
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
                    onChange={(e) => handleLocChecked(e)}
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
                    onChange={(e) => handleLocChecked(e)}
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
                    onChange={(e) => handleLocChecked(e)}
                  />
                  <label htmlFor='longueuil'>Longueuil</label>
                </div>
              </div>

              {errors.serviceLocation && errorMessage(locationRequired)}

              <hr />

              <div>
                <h1>Profile Image</h1>
              </div>

              {previewImg ? '' : <div className='subheader'>Upload a profile image.</div>}

              <div className='pills'>
                <div className='fileImg'>
                  {errors.fileSize && errorMessage(fileSize)}

                  {previewImg && (
                    <div>
                      <img src={previewImg} className='previewImg' />
                    </div>
                  )}
                  {previewImgName && <div>{previewImgName}</div>}

                  <input
                    type='file'
                    name='profileImg'
                    id='profileImg'
                    accept='image/*'
                    ref={register}
                    onChange={(e) => handleProfileImg(e)}
                  />
                  <label htmlFor='profileImg' className='button tertiary'>
                    Choose A File
                  </label>
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
