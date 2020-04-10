import React from 'react';
import './footer.css';
import { NavHashLink as NavLink } from 'react-router-hash-link';
import { useSelector } from 'react-redux';

const Footer = () => {
  const isLoggedIn = useSelector((state) => state.isLoggedIn);
  const isHelpr = useSelector((state) => state.isHelpr);

  const toggleMenuItems = () => {
    if (isLoggedIn && isHelpr) {
      return (
        <div className='menuItems left'>
          <NavLink to={'/#top'} className='menuItem'>
            Home
          </NavLink>
          <NavLink to={'/service-orders'} className='menuItem'>
            Service Orders
          </NavLink>
          <NavLink to={'/settings'} className='menuItem'>
            Account Settings
          </NavLink>
          <NavLink to={'/logout'} className='menuItem'>
            Logout
          </NavLink>
        </div>
      );
    }
    if (isLoggedIn && isHelpr === false) {
      return (
        <div className='menuItems left'>
          <NavLink to={'/#top'} className='menuItem'>
            Home
          </NavLink>
          <NavLink to={{ pathname: '/hire-a-helpr', state: { helprLocation: 'All' } }} className='menuItem'>
            Hire A Helpr
          </NavLink>
          <NavLink to={'/rate-a-helpr'} className='menuItem'>
            Rate A Helpr
          </NavLink>
          <NavLink to={'/logout'} className='menuItem'>
            Logout
          </NavLink>
        </div>
      );
    }
    if (!isLoggedIn) {
      return (
        <div className='menuItems left'>
          <NavLink to={'/#top'} className='menuItem'>
            Home
          </NavLink>
          <NavLink smooth to={'/#becomeAHelpr'} className='menuItem'>
            Become A helpr
          </NavLink>
          <NavLink to={{ pathname: '/hire-a-helpr', state: { helprLocation: 'All' } }} className='menuItem'>
            Hire A helpr
          </NavLink>
          <NavLink smooth to={'/#testimonials'} className='menuItem'>
            Testimonials
          </NavLink>
        </div>
      );
    }
  };

  return (
    <footer className='wrapper'>
      <div className='content'>
        <div className='box'>
          {toggleMenuItems()}
          <div className='right'>
            <div className='brand'>
              <NavLink to={'/#top'} className='logo'>
                help<span className='r'>r</span>
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
