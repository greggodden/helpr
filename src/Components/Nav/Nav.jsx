import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { NavHashLink as NavLink } from 'react-router-hash-link';
import { useSelector, useDispatch } from 'react-redux';
import './nav.css';

const Nav = () => {
  // USER STATE & TYPE
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.isLoggedIn);
  const isHelpr = useSelector((state) => state.isHelpr);

  // MENU STATE
  const [menuOpen, setMenuOpen] = useState(false);

  // MENU STYLE CLASSES
  const toggleMenuClass = menuOpen ? 'menuWrapper open' : 'menuWrapper close';
  const toggleMenuIconClass = menuOpen ? 'brand menu isOpen' : 'brand menu';

  // MENU HANDLER
  const toggleMenuItems = () => {
    if (isLoggedIn && isHelpr) {
      return (
        <div className='content menuItems'>
          <NavLink to={'/#top'} className='menuItem' onClick={() => setMenuOpen(false)}>
            Home
          </NavLink>
          <NavLink to={'/service-orders'} className='menuItem' onClick={() => setMenuOpen(false)}>
            Service Orders
          </NavLink>
          <NavLink to={'/settings'} className='menuItem' onClick={() => setMenuOpen(false)}>
            Account Settings
          </NavLink>
          <NavLink
            to={'/'}
            className='menuItem'
            onClick={() => {
              setMenuOpen(false);
              dispatch({ type: 'logout' });
            }}
          >
            Logout
          </NavLink>
        </div>
      );
    }
    if (isLoggedIn && isHelpr === false) {
      return (
        <div className='content menuItems'>
          <NavLink to={'/#top'} className='menuItem' onClick={() => setMenuOpen(false)}>
            Home
          </NavLink>
          <NavLink
            to={{ pathname: '/hire-a-helpr', state: { helprLocation: 'All' } }}
            className='menuItem'
            onClick={() => setMenuOpen(false)}
          >
            Hire A Helpr
          </NavLink>
          <NavLink to={'/rate-a-helpr'} className='menuItem' onClick={() => setMenuOpen(false)}>
            Rate A Helpr
          </NavLink>
          <NavLink
            to={'/'}
            className='menuItem'
            onClick={() => {
              setMenuOpen(false);
              dispatch({ type: 'logout' });
            }}
          >
            Logout
          </NavLink>
        </div>
      );
    }
    if (!isLoggedIn) {
      return (
        <div className='content menuItems'>
          <NavLink to={'/#top'} className='menuItem' onClick={() => setMenuOpen(false)}>
            Home
          </NavLink>
          <NavLink smooth to={'/#becomeAHelpr'} className='menuItem' onClick={() => setMenuOpen(false)}>
            Become A helpr
          </NavLink>
          <NavLink
            to={{ pathname: '/hire-a-helpr', state: { helprLocation: 'All' } }}
            className='menuItem'
            onClick={() => setMenuOpen(false)}
          >
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
  const toggleLoginButtonClass = !isLoggedIn ? 'buttons show' : 'buttons hide';
  const toggleLogoutButtonClass = isLoggedIn ? 'buttons show' : 'buttons hide';

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
              <NavLink to={'/#top'} className='logo' onClick={() => setMenuOpen(false)}>
                help<span className='r'>r</span>
              </NavLink>
            </div>
          </div>
          <div className='navSection navRight'>
            <div className={toggleLoginButtonClass}>
              <Link
                to={'/sign-up'}
                className='button primary'
                onClick={() => {
                  setMenuOpen(false);
                  dispatch({ type: 'isHelpr', payload: false });
                  console.log('sign-up as user - helpr is: ', isHelpr);
                }}
              >
                Sign-Up
              </Link>
              <Link to={'/login'} className='button secondary' onClick={() => setMenuOpen(false)}>
                Login
              </Link>
            </div>
            <div className={toggleLogoutButtonClass}>
              <Link
                to={'/'}
                className='button primary'
                onClick={() => {
                  setMenuOpen(false);
                  dispatch({ type: 'logout' });
                }}
              >
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
