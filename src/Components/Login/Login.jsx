import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useHistory } from 'react-router-dom';
import { AiOutlineLock, AiOutlineLogin, AiOutlineWarning } from 'react-icons/ai';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import './login.css';

const Alert = props => {
  return <MuiAlert elevation={6} variant='filled' {...props} />;
};

const Login = () => {
  // SET INITIAL STATES
  const [open, setOpen] = useState(false);
  const [alertType, setAlertType] = useState('');
  const [alertMsg, setAlertMsg] = useState('');
  const history = useHistory();

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
    setOpen(false);
  };

  // TOGGLE ALERT
  const toggleAlert = (msg, type) => {
    setAlertType(type);
    setAlertMsg(msg);
    setOpen(true);
  };

  // FORM HANDLERS
  const { register, handleSubmit, errors } = useForm();
  const onSubmit = async field => {
    const data = new FormData();
    data.append('email', field.email);
    data.append('password', field.password);
    const response = await fetch('/login', { method: 'POST', body: data });
    let body = await response.text();
    body = JSON.parse(body);

    if (body.openSession) history.push('/hire-a-helpr');
  };

  console.log('form errors:', errors);

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

            <button className='button reverse'>
              <AiOutlineLogin /> Login
            </button>
          </form>

          <div>
            Don't have an account? <Link to={{ pathname: '/sign-up', state: { helpr: false } }}>Sign-Up</Link>.
          </div>

          <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
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
