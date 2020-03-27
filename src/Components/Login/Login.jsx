import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { Link, useHistory } from 'react-router-dom';
import { AiOutlineLock, AiOutlineLogin, AiOutlineWarning } from 'react-icons/ai';
import { Snackbar, CircularProgress } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import './login.css';

const Alert = props => {
  return <MuiAlert elevation={6} variant='filled' {...props} />;
};

const Login = () => {
  // SET INITIAL STATES
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(state => state.isLoggedIn);
  const isHelpr = useSelector(state => state.isHelpr);
  const [open, setOpen] = useState(false);
  const [alertType, setAlertType] = useState('');
  const [alertMsg, setAlertMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();

  // ON COMPONENT DID MOUNT
  useEffect(() => {
    if (isLoggedIn) {
      toggleAlert('You are already logged in.', 'info');
      return;
    }
  }, []);

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
          <AiOutlineLogin /> Login
        </>
      );
    }
    return <CircularProgress variant='indeterminate' size='1rem' />;
  };

  // FORM HANDLERS
  const { register, handleSubmit, errors } = useForm();
  const onSubmit = async field => {
    setIsLoading(true);
    const data = new FormData();
    data.append('emailInput', field.email);
    data.append('passwordInput', field.password);
    const response = await fetch('/login', { method: 'POST', body: data });
    let body = await response.text();
    body = JSON.parse(body);

    setIsLoading(false);

    console.log('body: ', body);
    if (!body.success) {
      console.log('login failed.');
      toggleAlert(body.message, 'error');
      return;
    }

    console.log('login successful.');
    dispatch({ type: 'login-success' });
    dispatch({ type: 'isHelpr', payload: body.isHelpr });
    dispatch({ type: 'userId', payload: body.id });
    toggleAlert(body.message, 'success');
    return;
  };

  // ERROR MESSAGES
  const required = 'This field is required.';
  const maxLength = 'Input exeeds maximum length.';
  const pattern = 'Input format is not valid.';

  //ERROR HANDLER
  const errorMessage = error => {
    return (
      <div className='error'>
        <AiOutlineWarning /> {error}
      </div>
    );
  };

  return (
    <section className='login'>
      <div className='content container'>
        <div className='formWrapper'>
          <div className='loginIcon'>
            <AiOutlineLock />
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <input
              className='primaryInput'
              type='text'
              placeholder='Email'
              name='email'
              autoFocus={true}
              ref={register({
                required: true,
                maxLength: 80,
                pattern: /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/i
              })}
            />
            {errors.email && errors.email.type === 'required' && errorMessage(required)}
            {errors.email && errors.email.type === 'maxLength' && errorMessage(maxLength)}
            {errors.email && errors.email.type === 'pattern' && errorMessage(pattern)}

            <input
              className='primaryInput'
              type='password'
              placeholder='Password'
              name='password'
              ref={register({ required: true })}
            />
            {errors.password && errors.password.type === 'required' && errorMessage(required)}

            <button className='button reverse'>{getBtnText()}</button>
          </form>

          <div>
            Don't have an account? <Link to={{ pathname: '/sign-up', state: { helpr: false } }}>Sign-Up</Link>.
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

export default Login;
