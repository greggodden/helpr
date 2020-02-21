import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './nav.css';

const Nav = props => {
  const loggedIn = useSelector(state => state.loggedIn);
  const userType = useSelector(state => state.userType);

  return (
    <div className='nav wrapper'>
      <div className='content'>
        <div className='navSection navLeft'>
          <div className='brand menu'>MENU</div>
          <div className='brand logo'>
            help<span className='r'>r</span>
          </div>
        </div>
        <div className='navSection navRight'>
          <div className={!loggedIn ? 'buttons show' : 'buttons hide'}>
            <div className='primaryButton'>
              <Link to={'/sign-up'}>Sign-Up</Link>
            </div>
            <div className='secondaryButton'>
              <Link to={'/login'}>Login</Link>
            </div>
          </div>
          <div className={loggedIn ? 'buttons show' : 'buttons hide'}>
            <div className='primaryButton'>
              <Link to={'/logout'}>Logout</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Nav;
