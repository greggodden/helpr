import React from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { AiOutlineLock, AiOutlineLogin, AiOutlineWarning } from 'react-icons/ai';
import './login.css';

const Login = () => {
  // FORM HANDLERS
  const { register, handleSubmit, errors } = useForm();
  const onSubmit = data => console.log(data);
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
        </div>
      </div>
    </section>
  );
};

export default Login;
