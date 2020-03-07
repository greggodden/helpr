import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { NavHashLink as NavLink } from 'react-router-hash-link';
import { useSelector } from 'react-redux';
import './nav.css';

const Nav = props => {
  // USER STATE & TYPE
  const loggedIn = useSelector(state => state.loggedIn);
  const userType = useSelector(state => state.userType);

  // MENU STATE
  const [menuOpen, setMenuOpen] = useState(false);

  // MENU STYLE CLASSES
  const toggleMenuClass = menuOpen ? 'menuWrapper open' : 'menuWrapper close';
  const toggleMenuIconClass = menuOpen ? 'brand menu isOpen' : 'brand menu';

  // MENU HANDLER
  const toggleMenuItems = () => {
    if (userType === 'helpr') {
      return (
        <div className='content menuItems'>
          <NavLink to={'/#top'} className='menuItem' onClick={() => setMenuOpen(false)}>
            Home
          </NavLink>
          <NavLink to={'/bookings'} className='menuItem' onClick={() => setMenuOpen(false)}>
            View Bookings
          </NavLink>
          <NavLink to={'/settings'} className='menuItem' onClick={() => setMenuOpen(false)}>
            Account Settings
          </NavLink>
          <NavLink to={'/logout'} className='menuItem' onClick={() => setMenuOpen(false)}>
            Logout
          </NavLink>
        </div>
      );
    }
    if (userType === 'user') {
      return (
        <div className='content menuItems'>
          <NavLink to={'/#top'} className='menuItem' onClick={() => setMenuOpen(false)}>
            Home
          </NavLink>
          <NavLink to={'/hire-a-helpr'} className='menuItem' onClick={() => setMenuOpen(false)}>
            Hire A Helpr
          </NavLink>
          <NavLink to={'/rate-a-helpr'} className='menuItem' onClick={() => setMenuOpen(false)}>
            Rate A Helpr
          </NavLink>
          <NavLink to={'/logout'} className='menuItem' onClick={() => setMenuOpen(false)}>
            Logout
          </NavLink>
        </div>
      );
    }
    if (userType === 'all') {
      return (
        <div className='content menuItems'>
          <NavLink to={'/#top'} className='menuItem' onClick={() => setMenuOpen(false)}>
            Home
          </NavLink>
          <NavLink smooth to={'/#becomeAHelpr'} className='menuItem' onClick={() => setMenuOpen(false)}>
            Become A helpr
          </NavLink>
          <NavLink to={'/hire-a-helpr'} className='menuItem' onClick={() => setMenuOpen(false)}>
            Hire A helpr
          </NavLink>
          <NavLink smooth to={'/#testimonials'} className='menuItem' onClick={() => setMenuOpen(false)}>
            Testimonials
          </NavLink>
        </div>
      );
    }
  };

  // BUTTON STYLE CLASSES
  const toggleLoginButtonClass = !loggedIn ? 'buttons show' : 'buttons hide';
  const toggleLogoutButtonClass = loggedIn ? 'buttons show' : 'buttons hide';

  return (
    <>
      <div className={toggleMenuClass}>{toggleMenuItems()}</div>
      <nav className='wrapper'>
        <div className='content'>
          <div className='navSection navLeft'>
            <div className={toggleMenuIconClass} onClick={() => (menuOpen ? setMenuOpen(false) : setMenuOpen(true))}>
              <div className='bar1'></div>
              <div className='bar2'></div>
              <div className='bar3'></div>
            </div>
            <div className='brand'>
              <NavLink to={'/#top'} className='logo'>
                help<span className='r'>r</span>
              </NavLink>
            </div>
          </div>
          <div className='navSection navRight'>
            <div className={toggleLoginButtonClass}>
              <Link to={{ pathname: '/sign-up', state: { helpr: false } }} className='button primary'>
                Sign-Up
              </Link>
              <Link to={'/login'} className='button secondary'>
                Login
              </Link>
            </div>
            <div className={toggleLogoutButtonClass}>
              <Link to={'/logout'} className='button primary'>
                Logout
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Nav;
