import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { Link, useHistory } from 'react-router-dom';
import { AiOutlineCalendar, AiOutlineWarning, AiOutlineTool } from 'react-icons/ai';
import { Snackbar, CircularProgress, createMuiTheme } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import { KeyboardDateTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import { ThemeProvider } from '@material-ui/styles';
import MomentUtils from '@date-io/moment';
import './orderdialog.css';

const calendarTheme = createMuiTheme({
  palette: {
    primary: {
      main: '#ff2e63',
    },
  },
});

const Alert = (props) => {
  return <MuiAlert elevation={6} variant='filled' {...props} />;
};

const OrderDialog = () => {
  // SET INITIAL STATES
  const dispatch = useDispatch();
  const history = useHistory();
  const isLoggedIn = useSelector((state) => state.isLoggedIn);
  const isHelpr = useSelector((state) => state.isHelpr);
  const orderDialogOpen = useSelector((state) => state.toggleOrderDialog);
  const helprToHire = useSelector((state) => state.helprToHire);
  const userId = useSelector((state) => state.userId);
  const [userData, setUserData] = useState();
  const [open, setOpen] = useState(false);
  const [alertType, setAlertType] = useState('');
  const [alertMsg, setAlertMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isChecked, setIsChecked] = useState([]);
  const [notChecked, setNotChecked] = useState(['plantr', 'mowr', 'rakr', 'plowr']);
  const [useExisting, setUseExisting] = useState(['useExisting']);
  const [selectedDate, handleDateChange] = useState(new Date());
  const [rate, setRate] = useState(0);
  const [sqft, setSqft] = useState();
  const [orderTotal, setOrderTotal] = useState(0);
  const [serviceCharge, setServiceCharge] = useState(0.15);
  const [inputFirstName, setInputFirstName] = useState('');
  const [inputLastName, setInputLastName] = useState('');
  const [inputPhoneNumber, setInputPhoneNumber] = useState('');
  const [inputAddress, setInputAddress] = useState('');
  const [inputCity, setInputCity] = useState('');
  const [inputPostalCode, setInputPostalCode] = useState('');

  // ON COMPONENT DID MOUNT
  useEffect(() => {
    getUserData(userId);
  }, []);

  // ON COMPONENT DID UPDATE
  useEffect(() => {
    getTotal();
  }, [sqft, rate, serviceCharge]);

  // TOGGLE CHECKED BOXES
  const toggleChecked = (e) => {
    if (!e) return;

    const type = e.target.name;
    const currRate = getRate(type);

    // REMOVE CHECKED TYPE
    if (!e.target.checked && isChecked.includes(type)) {
      setIsChecked((isChecked) => isChecked.filter((loc) => loc !== type));
      setNotChecked((notChecked) => notChecked.concat(type));
      setRate(0);
      clearError();
      return;
    }

    // ADD CHECKED TYPE
    if (e.target.checked && !isChecked.includes(type)) {
      if (rate !== 0) {
        console.log('serviceRate error');
        setError('serviceRate', 'oneService', oneService);
        return;
      }
      setIsChecked((isChecked) => isChecked.concat(type));
      setNotChecked((notChecked) => notChecked.filter((name) => name !== type));
      setRate(Number(currRate).toFixed(2));
      return;
    }
  };

  // TOGGLE USE EXISTING
  const toggleUseExisting = (e) => {
    if (!e) return;

    const type = e.target.name;

    // REMOVE CHECKED TYPE
    if (!e.target.checked && useExisting.includes(type)) {
      setUseExisting([]);
      return;
    }

    // ADD CHECKED TYPE
    if (e.target.checked && !useExisting.includes(type)) {
      const user = userData.payload;
      setUseExisting((useExisting) => useExisting.concat(type));
      setInputFirstName(user.firstName);
      setInputLastName(user.lastName);
      setInputPhoneNumber(user.phoneNumber);
      setInputAddress(user.address);
      setInputCity(user.city);
      setInputPostalCode(user.postalCode);
      return;
    }
  };

  // GET USER DATA
  const getUserData = async (_id) => {
    console.log('getting user data');
    const data = new FormData();
    data.append('_id', _id);
    const response = await fetch('/getUserData', { method: 'POST', body: data });
    let body = await response.text();
    body = JSON.parse(body);
    const user = body.payload;

    if (body.success === false) {
      console.log('Error retreiving user data: ', body.message);
      setUseExisting([]);
      toggleAlert(body.message, 'error');
      return;
    }

    console.log('user data retreived successfully.', body);
    setUserData(body);

    console.log('user: ', user);
    setInputFirstName(user.firstName);
    setInputLastName(user.lastName);
    setInputPhoneNumber(user.phoneNumber);
    setInputAddress(user.address);
    setInputCity(user.city);
    setInputPostalCode(user.postalCode);
  };

  // RETREIVE SERVICE RATES
  const getRate = (type) => {
    if (!helprToHire.serviceTypes.includes(type)) return;
    const result = helprToHire.serviceRates.find((rate) => {
      const servType = Object.getOwnPropertyNames(rate).toString();
      if (servType === type) return Number(rate[type]);
    });
    return result[type];
  };

  // CALCULATE TOTAL
  const getTotal = () => {
    const subTotal = rate * sqft;
    console.log('subTotal: ', subTotal);
    const fees = subTotal * serviceCharge;
    console.log('serviceCharge: ', fees);
    const total = subTotal + fees;
    console.log('total: ', total.toFixed(2));

    if (total === NaN || !total) return setOrderTotal(Number(0.0).toFixed(2));
    setOrderTotal(Number(total).toFixed(2));
    return;
  };

  // HANDLE USER DATA CHANGE
  const handleUserDataChange = (e) => {
    const fieldToChange = e.target.name;
    const value = e.target.value;
    if (fieldToChange === 'firstName') return setInputFirstName(value);
    if (fieldToChange === 'lastName') return setInputLastName(value);
    if (fieldToChange === 'phoneNumber') return setInputPhoneNumber(value);
    if (fieldToChange === 'address') return setInputAddress(value);
    if (fieldToChange === 'city') return setInputCity(value);
    if (fieldToChange === 'postalCode') return setInputPostalCode(value);
    return;
  };

  // HANDLE CHANGES TO SQFT FIELD
  const handleSqftChange = (e) => {
    console.log('sqft: ', e.target.value);
    clearError();
    const regex = RegExp(/([0-9])/i);
    if (!regex.test(e.target.value)) {
      setError('sqft', 'invalidSqft', invalidSqft);
      return;
    }
    setSqft(Number(e.target.value));
    return;
  };

  // CLOSE ALERT
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    if (reason === 'orderDialog') {
      dispatch({ type: 'toggleOrderDialog' });
      return;
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
          <AiOutlineTool /> Request Service
        </>
      );
    }
    return <CircularProgress variant='indeterminate' size='1rem' />;
  };

  // FORM HANDLERS
  const { register, handleSubmit, errors, setError, clearError } = useForm();
  const onSubmit = async (field) => {};

  // ERROR MESSAGES
  const accountRequired = 'You must be logged in to hire a helpr.';
  const noHelprs = 'helprs cannot hire helprs, please sign-up or login to a user account.';
  const oneService = 'Maximum 1 service per order.';
  const invalidSqft = 'Invalid entry: Only numbers allowed.';
  const required = 'This field is required.';
  const minLength = 'Input does not meet minimum length requirement.';
  const maxLength = 'Input exeeds maximum length.';

  //ERROR HANDLER
  const errorMessage = (error) => {
    return (
      <div className='error'>
        <AiOutlineWarning /> {error}
      </div>
    );
  };

  return (
    <section className='orderDialog'>
      <div className='content container'>
        <div className='formWrapper'>
          <div className='closeToggle'>
            <div className='isOpen' onClick={() => handleClose(null, 'orderDialog')}>
              <div className='s1'></div>
              <div className='s2'></div>
            </div>
          </div>

          <div className='orderContainer'>
            <div className='helprProfile col'>
              <div className='profileSection col'>
                <div>
                  <img
                    className='profileImg'
                    src={helprToHire.profileImg ? helprToHire.profileImg : '/uploads/defaultProfileImg.png'}
                  />
                </div>
                <div className='profileName'>
                  {helprToHire.firstName} {helprToHire.lastName}
                </div>
              </div>

              <hr />

              <div className='profileSection col profileDetails'>
                <div>{helprToHire.address}</div>
                <div>{helprToHire.city}</div>
                <div>{helprToHire.postalCode}</div>
                <div>{helprToHire.phoneNumber}</div>
              </div>

              <div className='profileSection row'>
                <a
                  href={'mailto:' + helprToHire.email + '?subject=Question%20from%20helpr.com'}
                  className='button tertiary'
                >
                  Contact <span className='lower'>helpr</span>
                </a>
              </div>
            </div>
            <div className='orderForm col'>
              <div className='orderIcon'>
                <AiOutlineCalendar />
              </div>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className='formSection row'>
                  <div className='formSection col'>
                    <div className='formDetails'>
                      <div className='subheader'>Select a service</div>
                      <div className='row'>
                        {helprToHire.serviceTypes.map((type) => (
                          <div
                            className={isChecked.includes(type) ? 'static ' + type + ' checked' : 'static ' + type}
                            key={Math.floor(Math.random() * 10000000000)}
                          >
                            <input
                              type='checkbox'
                              name={type}
                              id={type}
                              ref={register}
                              checked={isChecked.includes(type)}
                              onChange={toggleChecked}
                            />
                            <label htmlFor={type}>{type + ' ($' + getRate(type) + '/sqft)'}</label>
                          </div>
                        ))}
                      </div>

                      {errors.serviceRate && errors.serviceRate.type === 'oneService' && errorMessage(oneService)}
                    </div>
                    <div className='formDetails'>
                      <div className='subheader'>Select a date</div>
                      <div>
                        <MuiPickersUtilsProvider utils={MomentUtils}>
                          <ThemeProvider theme={calendarTheme}>
                            <KeyboardDateTimePicker
                              label='Calendar'
                              inputVariant='outlined'
                              showTodayButton
                              disablePast
                              value={selectedDate}
                              onChange={handleDateChange}
                              minutesStep={5}
                            />
                          </ThemeProvider>
                        </MuiPickersUtilsProvider>
                      </div>
                    </div>
                    <div className='formDetails'>
                      <div className='subheader'>Calculate cost</div>
                      <input
                        className='secondaryInput'
                        type='text'
                        name='sqft'
                        placeholder='SQFT'
                        value={sqft}
                        ref={register}
                        onChange={handleSqftChange}
                      />{' '}
                      x $<span className='bold'>{rate}</span> + <span className='italic'>15% Service Charge</span>
                      <div className='subheader bold'>
                        TOTAL: <span className='r'>${orderTotal}</span>
                      </div>
                      {errors.sqft && errors.sqft.type === 'invalidSqft' && errorMessage(invalidSqft)}
                    </div>
                  </div>
                  <div className='formSection col'>
                    <div className='subheader'>Service Location</div>
                    <div className='useLocation'>
                      <input
                        type='checkbox'
                        name='useExisting'
                        id='useExisting'
                        checked={useExisting.includes('useExisting')}
                        onChange={toggleUseExisting}
                      />
                      <label htmlFor='useExisting'>Use location on file</label>
                    </div>
                    <div className='formBox'>
                      <div>
                        <input
                          className={useExisting.includes('useExisting') ? 'secondaryInput disabled' : 'secondaryInput'}
                          type='text'
                          placeholder='First name'
                          name='firstName'
                          value={inputFirstName}
                          onChange={(e) => handleUserDataChange(e)}
                          disabled={useExisting.includes('useExisting') && true}
                          ref={register({ required: true, maxLength: 40 })}
                        />
                        {errors.firstName && errors.firstName.type === 'required' && errorMessage(required)}
                        {errors.firstName && errors.firstName.type === 'maxLength' && errorMessage(maxLength)}
                      </div>
                      <div>
                        <input
                          className={useExisting.includes('useExisting') ? 'secondaryInput disabled' : 'secondaryInput'}
                          type='text'
                          placeholder='Last name'
                          name='lastName'
                          value={inputLastName}
                          onChange={(e) => handleUserDataChange(e)}
                          disabled={useExisting.includes('useExisting') && true}
                          ref={register({ required: true, maxLength: 40 })}
                        />
                        {errors.lastName && errors.lastName.type === 'required' && errorMessage(required)}
                        {errors.lastName && errors.lastName.type === 'maxLength' && errorMessage(maxLength)}
                      </div>
                    </div>

                    <input
                      className={useExisting.includes('useExisting') ? 'secondaryInput disabled' : 'secondaryInput'}
                      type='tel'
                      placeholder='Phone number'
                      name='phoneNumber'
                      value={inputPhoneNumber}
                      onChange={(e) => handleUserDataChange(e)}
                      disabled={useExisting.includes('useExisting') && true}
                      ref={register({ required: true, minLength: 6, maxLength: 12 })}
                    />
                    {errors.phoneNumber && errors.phoneNumber.type === 'required' && errorMessage(required)}
                    {errors.phoneNumber && errors.phoneNumber.type === 'minLength' && errorMessage(minLength)}
                    {errors.phoneNumber && errors.phoneNumber.type === 'maxLength' && errorMessage(maxLength)}

                    <input
                      className={useExisting.includes('useExisting') ? 'secondaryInput disabled' : 'secondaryInput'}
                      type='text'
                      placeholder='Address'
                      name='address'
                      value={inputAddress}
                      onChange={(e) => handleUserDataChange(e)}
                      disabled={useExisting.includes('useExisting') && true}
                      ref={register({ required: true, maxLength: 100 })}
                    />
                    {errors.address && errors.address.type === 'required' && errorMessage(required)}
                    {errors.address && errors.address.type === 'maxLength' && errorMessage(maxLength)}

                    <select
                      className={useExisting.includes('useExisting') ? 'secondarySelect disabled' : 'secondarySelect'}
                      name='city'
                      value={inputCity}
                      onChange={(e) => handleUserDataChange(e)}
                      disabled={useExisting.includes('useExisting') && true}
                      ref={register({ required: true, validate: (value) => value !== 'DEFAULT' || required })}
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
                      className={useExisting.includes('useExisting') ? 'secondaryInput disabled' : 'secondaryInput'}
                      type='text'
                      placeholder='Postal Code'
                      name='postalCode'
                      value={inputPostalCode}
                      onChange={(e) => handleUserDataChange(e)}
                      disabled={useExisting.includes('useExisting') && true}
                      ref={register({ required: true, minLength: 6, maxLength: 7 })}
                    />
                    {errors.postalCode && errors.postalCode.type === 'required' && errorMessage(required)}
                    {errors.postalCode && errors.postalCode.type === 'minLength' && errorMessage(minLength)}
                    {errors.postalCode && errors.postalCode.type === 'maxLength' && errorMessage(maxLength)}
                  </div>
                </div>
                <button className='button reverse' type='submit'>
                  {getBtnText()}
                </button>
              </form>
            </div>
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

export default OrderDialog;
