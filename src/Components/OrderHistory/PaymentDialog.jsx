import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { AiOutlineWarning, AiOutlineDollar, AiOutlineRightCircle } from 'react-icons/ai';
import { Snackbar, CircularProgress } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import moment from 'moment';
import './paymentdialog.css';

const Alert = (props) => {
  return <MuiAlert elevation={6} variant='filled' {...props} />;
};

const PaymentDialog = () => {
  // SET INITIAL STATES
  const dispatch = useDispatch();
  const elements = useElements();
  const stripe = useStripe();
  const orderDetails = useSelector((state) => state.orderToPay);
  const userId = useSelector((state) => state.userId);
  const [statusChanged, setStatusChanged] = useState(false);
  const [userData, setUserData] = useState();
  const [open, setOpen] = useState(false);
  const [alertType, setAlertType] = useState('');
  const [alertMsg, setAlertMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [useExisting, setUseExisting] = useState(['useExisting']);
  const [inputFirstName, setInputFirstName] = useState('');
  const [inputLastName, setInputLastName] = useState('');
  const [inputAddress, setInputAddress] = useState('');
  const [inputCity, setInputCity] = useState('');
  const [inputPostalCode, setInputPostalCode] = useState('');

  // ON COMPONENT DID MOUNT
  useEffect(() => {
    getUserData(userId);
  }, []);

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

    setInputFirstName(user.firstName);
    setInputLastName(user.lastName);
    setInputAddress(user.address);
    setInputCity(user.city);
    setInputPostalCode(user.postalCode);
  };

  // HANDLE USER DATA CHANGE
  const handleUserDataChange = (e) => {
    const fieldToChange = e.target.name;
    const value = e.target.value;
    if (fieldToChange === 'firstName') return setInputFirstName(value);
    if (fieldToChange === 'lastName') return setInputLastName(value);
    if (fieldToChange === 'address') return setInputAddress(value);
    if (fieldToChange === 'city') return setInputCity(value);
    if (fieldToChange === 'postalCode') return setInputPostalCode(value);
    return;
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
      setInputAddress(user.address);
      setInputCity(user.city);
      setInputPostalCode(user.postalCode);
      return;
    }
  };

  // CLOSE ALERT
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    if (reason === 'paymentDialog') {
      dispatch({ type: 'togglePaymentDialog' });
      return;
    }
    if (alertType === 'error' || alertType === 'warning') {
      setOpen(false);
      return;
    }
    if (alertType === 'success') {
      setOpen(false);
      dispatch({ type: 'togglePaymentDialog' });
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
          <AiOutlineRightCircle /> Pay Now
        </>
      );
    }
    return <CircularProgress variant='indeterminate' size='1rem' />;
  };

  // FORM HANDLERS
  const { register, handleSubmit, errors, setError, clearError } = useForm();
  const onSubmit = async () => {
    setIsLoading(true);

    if (!stripe || !elements) {
      console.log('stripe not loaded yet');
      toggleAlert('Error connecting to payment server. Please try again.');
      return;
    }

    const data = new FormData();
    data.append('orderTotal', orderDetails.orderTotal);
    data.append('orderId', orderDetails._id);

    try {
      const response = await fetch('/getIntent', { method: 'POST', body: data });
      let body = await response.text();
      body = JSON.parse(body);
      const paymentIntent = body.payload;
      const clientSecret = paymentIntent.client_secret;

      console.log('paymentIntent: ', paymentIntent);
      console.log('clientSecret: ', clientSecret);

      if (response.success === false) {
        console.log('failed to generate payment intent');
        toggleAlert(body.message, 'error');
        setIsLoading(false);
        return;
      }

      handleProcessPayment(clientSecret);
      setIsLoading(false);
      return;
    } catch (err) {
      console.log('payment intent error: ', err);
      toggleAlert(err, 'error');
      setIsLoading(false);
      return;
    }
  };

  // PROCESS PAYMENT
  const handleProcessPayment = async (clientSecret) => {
    console.log('handling payment processing');
    const fullName = inputFirstName + ' ' + inputLastName;

    try {
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: fullName,
            address: {
              city: inputCity,
              country: 'CA',
              line1: inputAddress,
              state: 'QC',
              postal_code: inputPostalCode,
            },
          },
        },
      });

      console.log('payment processing result: ', result);

      if (result.error) {
        console.log('result error: ', result.error.message);
        toggleAlert(result.error.message, 'error');
        setIsLoading(false);
        return;
      }

      if (result.paymentIntent.status === 'succeeded') {
        console.log('Payment processed successfully.', result.paymentIntent.status);
        toggleAlert('Payment processed successfully.', 'success');
        setIsLoading(false);
        updateOrderStatus(orderDetails._id, 'complete');
        return;
      }
    } catch (err) {
      console.log('error processing payment: ', err);
      toggleAlert(err, 'error');
      setIsLoading(False);
      return;
    }
  };

  // UPDATE ORDER STATUS
  const updateOrderStatus = async (orderId, action) => {
    console.log('updating order status');

    const data = new FormData();
    data.append('orderId', orderId);
    data.append('newStatus', action);

    try {
      const response = await fetch('/updateOrderStatus', { method: 'POST', body: data });
      let body = await response.text();
      body = JSON.parse(body);
      const result = body.payload;

      if (body.success === false) {
        console.log('Failed to update order status.');
        toggleAlert(body.message, 'error');
        return;
      }

      console.log('order status updated successfully');
      return;
    } catch (err) {
      console.log('Error trying to update state');
      return;
    }
  };

  // ERROR MESSAGES
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
    <>
      <section className='orderDialog'>
        <div className='content container'>
          <div className='formWrapper'>
            <div className='closeToggle'>
              <div className='isOpen' onClick={() => handleClose(null, 'paymentDialog')}>
                <div className='s1'></div>
                <div className='s2'></div>
              </div>
            </div>
            <div className='orderContainer'>
              <div className='helprProfile col'>
                <div className='profileSection col'>
                  <div className='subheader'>Order # {orderDetails._id.substring(0, 10)}</div>
                </div>
                <div className='profileSection col'>
                  <div>
                    <span className='italic'>Service Date:</span>{' '}
                    {moment(orderDetails.date._i).format('DD-MM-YY hh:mm A')}
                  </div>
                  <div>
                    <span className='italic'>Service Type:</span> {orderDetails.serviceType}
                  </div>
                  <div>
                    <span className='italic'>SQFT:</span> {orderDetails.sqft}
                  </div>
                </div>
                <div className='profileSection row'>
                  <span className='bold'>Total: ${orderDetails.orderTotal}</span>
                </div>
              </div>
              <div className='orderForm col'>
                <div className='orderIcon'>
                  <AiOutlineDollar />
                </div>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className='formSection col'>
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

                  <hr />

                  <div className='formSection col'>
                    <div className='subheader'>Payment Details</div>
                    <div>
                      <CardElement />
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
    </>
  );
};

export default PaymentDialog;
