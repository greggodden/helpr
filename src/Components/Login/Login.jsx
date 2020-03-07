import React from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { IoIosContact } from 'react-icons/io';
import { AiOutlineLogin } from 'react-icons/ai';
import './login.css';

const Login = () => {
  const { register, handleSubmit, errors } = useForm();
  const onSubmit = data => console.log(data);
  console.log(errors);

  return (
    <section className='login'>
      <div className='content container'>
        <div className='formWrapper'>
        <div className='loginIcon'><IoIosContact /></div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <input
              type='text'
              placeholder='Email'
              name='Email'
              ref={register({ required: true, pattern: /^\S+@\S+$/i })}
            />
            <input type='password' placeholder='Password' name='Password' ref={register({ required: true, min: 8 })} />

            <button className='button reverse'><AiOutlineLogin /> Login</button>
          </form>
          <div>Don't have an account? <Link to='/sign-up'>Sign-Up</Link>.</div>
        </div>
      </div>
    </section>
  );
};

export default Login;
