import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './nav.css';

const Nav = props => {
  const loggedIn = useSelector(state => state.loggedIn);
  const userType = useSelector(state => state.userType);
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenuClass = menuOpen ? 'menuWrapper open' : 'menuWrapper close';
  const toggleMenuIconClass = menuOpen ? 'brand menu isOpen' : 'brand menu';

  const toggleMenuItems = () => {
    if (userType === 'helpr') {
      return (
        <div className='content menuItems'>
          <Link to={'/'} className='menuItem'>
            Home
          </Link>
          <Link to={'/bookings'} className='menuItem'>
            View Bookings
          </Link>
          <Link to={'/settings'} className='menuItem'>
            Account Settings
          </Link>
          <Link to={'/hire-a-helpr'} className='menuItem'>
            Logout
          </Link>
        </div>
      );
    }
    if (userType === 'user') {
      return (
        <div className='content menuItems'>
          <Link to={'/'} className='menuItem'>
            Home
          </Link>
          <Link to={'/hire-a-helpr'} className='menuItem'>
            Hire A Helpr
          </Link>
          <Link to={'/rate-a-helpr'} className='menuItem'>
            Rate A Helpr
          </Link>
          <Link to={'/hire-a-helpr'} className='menuItem'>
            Logout
          </Link>
        </div>
      );
    }
    if (userType === 'all') {
      return (
        <div className='content menuItems'>
          <Link to={'/'} className='menuItem'>
            Home
          </Link>
          <Link to={'/#becomeAHelpr'} className='menuItem'>
            Become A Helpr
          </Link>
          <Link to={'/hire-a-helpr'} className='menuItem'>
            Hire A Helpr
          </Link>
        </div>
      );
    }
  };

  const toggleLoginButtonClass = !loggedIn ? 'buttons show' : 'buttons hide';
  const toggleLogoutButtonClass = loggedIn ? 'buttons show' : 'buttons hide';

  return (
    <>
      <div className={toggleMenuClass}>{toggleMenuItems()}</div>
      <div className='nav wrapper'>
        <div className='content'>
          <div className='navSection navLeft'>
            <div className={toggleMenuIconClass} onClick={() => (menuOpen ? setMenuOpen(false) : setMenuOpen(true))}>
              <div className='bar1'></div>
              <div className='bar2'></div>
              <div className='bar3'></div>
            </div>
            <div className='brand'>
              <Link to={'/'} className='logo'>
                help<span className='r'>r</span>
              </Link>
            </div>
          </div>
          <div className='navSection navRight'>
            <div className={toggleLoginButtonClass}>
              <Link to={'/sign-up'} className='button primary'>
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
      </div>
    </>
  );
};

export default Nav;
