import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { AiOutlineWarning, AiOutlineStar, AiFillStar } from 'react-icons/ai';
import { Snackbar, CircularProgress, Dialog, DialogTitle } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import OrderDialog from './OrderDialog.jsx';
import './hireahelpr.css';

const Alert = (props) => {
  return <MuiAlert elevation={6} variant='filled' {...props} />;
};

const HireAHelpr = () => {
  // SET INITIAL STATES
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.isLoggedIn);
  const orderDialogOpen = useSelector((state) => state.orderDialogOpen);
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(true);
  const [alertType, setAlertType] = useState('');
  const [alertMsg, setAlertMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isChecked, setIsChecked] = useState(['plantr', 'mowr', 'rakr', 'plowr']);
  const [notChecked, setNotChecked] = useState(['North Shore', 'South Shore', 'Laval', 'Montreal', 'Longueuil']);
  const [helprs, setHelprs] = useState();
  const [isBooked, setIsBooked] = useState([]);

  // ON COMPONENT DID MOUNT
  useEffect(() => {
    getStartingLocations();
  }, []);

  // ON ISCHECKED/NOTCHECKED STATE CHANGE
  useEffect(() => {
    getHelprs();
  }, [isChecked, notChecked]);

  // ON ORDERDIALOGOPEN STATE CHANGE
  useEffect(() => {
    if (orderDialogOpen) {
      document.body.style.overflow = 'hidden';
      return;
    }
    if (!orderDialogOpen) {
      document.body.style.overflow = 'unset';
      return;
    }
  }, [orderDialogOpen]);

  // RETREIVE INITIAL LOCATIONS
  const getStartingLocations = () => {
    const startingLocation = location.state.helprLocation;
    const allLocations = ['North Shore', 'South Shore', 'Laval', 'Montreal', 'Longueuil'];

    if (startingLocation === 'All') {
      setIsChecked((isChecked) => isChecked.concat(allLocations));
      setNotChecked((notChecked) => notChecked.filter((loc) => !allLocations.includes(loc)));
      getHelprs();
      return;
    }

    if (startingLocation !== 'All') {
      setIsChecked((isChecked) => isChecked.concat(startingLocation));
      setNotChecked((notChecked) => notChecked.filter((loc) => loc !== startingLocation));
      getHelprs();
      return;
    }
  };

  // RETREIVE ALL HELPRS WHEN PAGE LOADED
  const getHelprs = async () => {
    setIsLoading(true);

    const data = new FormData();
    data.append('criteria', isChecked);

    const response = await fetch('/getHelprs', { method: 'POST', body: data });
    let body = await response.text();
    body = JSON.parse(body);

    setHelprs(body.payload);

    setIsLoading(false);
    return;
  };

  // TOGGLE CHECKED BOXES
  const toggleChecked = (e) => {
    if (!e) return;

    const type = e.target.name;

    // REMOVE CHECKED TYPE
    if (!e.target.checked && isChecked.includes(type)) {
      setIsChecked((isChecked) => isChecked.filter((loc) => loc !== type));
      setNotChecked((notChecked) => notChecked.concat(type));
      return;
    }

    // ADD CHECKED TYPE
    if (e.target.checked && !isChecked.includes(type)) {
      setIsChecked((isChecked) => isChecked.concat(type));
      setNotChecked((notChecked) => notChecked.filter((name) => name !== type));
      return;
    }
  };

  // TOGGLE SEARCH
  const toggleSearch = () => {
    if (searchOpen) return setSearchOpen(false);
    return setSearchOpen(true);
  };

  // CHECK IF INPUT IS CHECKED
  const checkIfChecked = (name) => {
    return isChecked.includes(name);
  };

  // CLOSE ALERT
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    if (alertType === 'error' || alertType === 'warning') {
      history.push('/login');
      setOpen(false);
      return;
    }

    setOpen(false);
  };

  // TOGGLE ALERT
  const toggleAlert = (msg, type) => {
    setAlertMsg(msg);
    setAlertType(type);
    setOpen(true);
  };

  // ERROR MESSAGES
  const accountRequired = 'You must be logged in to hire a helpr.';
  const noHelprs = 'helprs cannot hire helprs, please sign-up or login to a user account.';
  const orderOpen = 'Only one order window can be open at a time.';

  // RETURN STARS CODE
  const getStars = (count) => {
    const stars = [];
    const emptyStar = <AiOutlineStar />;
    const fullStar = <AiFillStar />;

    for (let i = 0; i < count; i++) {
      stars.push(fullStar);
    }

    if (stars.length === 0 || !stars) {
      stars.push(emptyStar);
    }

    return stars;
  };

  // HANDLE HIRE ME CLICK
  const handleHire = (helpr) => {
    // if (isLoggedIn === false) return toggleAlert(accountRequired, 'warning');
    // if (isHelpr) return toggleAlert(noHelprs, 'warning')
    // if (orderDialogOpen) return toggleAlert(orderOpen, 'warning')
    dispatch({ type: 'helprToHire', payload: helpr });
    dispatch({ type: 'toggleOrderDialog' });
  };

  return (
    <>
      {orderDialogOpen && <OrderDialog />}
      <section className='hireahelpr'>
        <div className='content container'>
          <h1>
            Hire A help<span className='rHelpr'>r</span>
          </h1>

          <div className='searchContainer'>
            <div className='searchToggle'>
              <div className='subheader searchTitle'>Search Options</div>
              <input
                type='checkbox'
                id='searchOptions'
                name='searchOptions'
                autoFocus={true}
                checked={searchOpen ? 'checked' : ''}
                onChange={toggleSearch}
              />
              <label htmlFor='searchOptions' className={searchOpen && 'isOpen'}>
                <div className='s1'></div>
                <div className='s2'></div>
              </label>
            </div>
            <div className={searchOpen ? 'searchOptions' : 'searchOptions closed'}>
              <div className='helprTypesWrapper'>
                <div className='subheader'>Choose helpr types</div>
                <div className='helprTypes'>
                  <input
                    type='checkbox'
                    id='plantrBox'
                    name='plantr'
                    checked={checkIfChecked('plantr')}
                    onChange={toggleChecked}
                  />
                  <label htmlFor='plantrBox'>
                    <img
                      title='Show/Hide plantrs'
                      src='/imgs/icoPlantr.jpg'
                      className={checkIfChecked('plantr') ? 'helprIco' : 'helprIco disabled'}
                    />
                  </label>
                  <input
                    type='checkbox'
                    id='mowrBox'
                    name='mowr'
                    checked={checkIfChecked('mowr')}
                    onChange={toggleChecked}
                  />
                  <label htmlFor='mowrBox'>
                    <img
                      title='Show/Hide mowrs'
                      src='/imgs/icoMowr.jpg'
                      className={checkIfChecked('mowr') ? 'helprIco' : 'helprIco disabled'}
                    />
                  </label>
                  <input
                    type='checkbox'
                    id='rakrBox'
                    name='rakr'
                    checked={checkIfChecked('rakr')}
                    onChange={toggleChecked}
                  />
                  <label htmlFor='rakrBox'>
                    <img
                      title='Show/Hide rakrs'
                      src='/imgs/icoRakr.jpg'
                      className={checkIfChecked('rakr') ? 'helprIco' : 'helprIco disabled'}
                    />
                  </label>
                  <input
                    type='checkbox'
                    id='plowrBox'
                    name='plowr'
                    checked={checkIfChecked('plowr')}
                    onChange={toggleChecked}
                  />
                  <label htmlFor='plowrBox'>
                    <img
                      title='Show/Hide plowrs'
                      src='/imgs/icoPlowr.jpg'
                      className={checkIfChecked('plowr') ? 'helprIco' : 'helprIco disabled'}
                    />
                  </label>
                </div>
              </div>

              <div className='helprLocationsWrapper'>
                <div className='subheader'>Choose helpr locations</div>
                <div className='helprLocations'>
                  <div className={checkIfChecked('North Shore') ? 'pill tertiary checked' : 'pill tertiary'}>
                    <input
                      type='checkbox'
                      name='North Shore'
                      id='northShore'
                      checked={checkIfChecked('North Shore')}
                      onChange={toggleChecked}
                    />
                    <label htmlFor='northShore'>North Shore</label>
                  </div>
                  <div className={checkIfChecked('South Shore') ? 'pill tertiary checked' : 'pill tertiary'}>
                    <input
                      type='checkbox'
                      name='South Shore'
                      id='southShore'
                      checked={checkIfChecked('South Shore')}
                      onChange={toggleChecked}
                    />
                    <label htmlFor='southShore'>South Shore</label>
                  </div>
                  <div className={checkIfChecked('Laval') ? 'pill tertiary checked' : 'pill tertiary'}>
                    <input
                      type='checkbox'
                      name='Laval'
                      id='laval'
                      checked={checkIfChecked('Laval')}
                      onChange={toggleChecked}
                    />
                    <label htmlFor='laval'>Laval</label>
                  </div>
                  <div className={checkIfChecked('Montreal') ? 'pill tertiary checked' : 'pill tertiary'}>
                    <input
                      type='checkbox'
                      name='Montreal'
                      id='montreal'
                      checked={checkIfChecked('Montreal')}
                      onChange={toggleChecked}
                    />
                    <label htmlFor='montreal'>Montreal</label>
                  </div>
                  <div className={checkIfChecked('Longueuil') ? 'pill tertiary checked' : 'pill tertiary'}>
                    <input
                      type='checkbox'
                      name='Longueuil'
                      id='longueuil'
                      checked={checkIfChecked('Longueuil')}
                      onChange={toggleChecked}
                    />
                    <label htmlFor='longueuil'>Longueuil</label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {isLoading && (
            <div className='nohelprs'>
              <CircularProgress variant='indeterminate' size='4rem' />
            </div>
          )}
          {!helprs && (
            <div className='subheader nohelprs'>
              <AiOutlineWarning /> No helprs found.
            </div>
          )}
          <div className='cards'>
            {helprs &&
              helprs.map((helpr) => (
                <div className='card helprdetails btmborder' key={helpr._id}>
                  <div className='cardsection cardicon helprIcon'>
                    <img src={helpr.profileImg ? helpr.profileImg : '/uploads/defaultProfileImg.png'} />
                  </div>
                  <div className='carddetails'>
                    <div className='cardcontainer'>
                      <div className='cardsection'>
                        <div className='subheader'>
                          <span className='bold'>
                            {helpr.firstName} {helpr.lastName}
                          </span>
                        </div>
                      </div>
                      <div className='cardsection cardpills'>
                        {getStars(helpr.rating).map((star) => {
                          return (
                            <div
                              className={helpr.rating > 0 ? 'star filled' : 'star'}
                              key={Math.floor(Math.random() * 10000000000)}
                            >
                              {star}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div className='cardcontainer'>
                    <div className='cardsection'>Service Types</div>
                    <div className='cardsection cardpills'>
                      {helpr.serviceTypes.map((type) => (
                        <div className={'static ' + type} key={helpr._id + type}>
                          {type}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className='cardcontainer'>
                    <div className='cardsection'>Service Locations</div>
                    <div className='cardsection cardpills'>
                      {helpr.serviceLocations.map((loc) => (
                        <div className='static alt' key={helpr._id + loc}>
                          {loc}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className='cardsection'>
                    <button
                      disabled={isBooked.includes(helpr._id) && 'true'}
                      className={isBooked.includes(helpr._id) ? 'button disabled' : 'button primary'}
                      onClick={() => handleHire(helpr)}
                    >
                      {isBooked.includes(helpr._id) ? 'booked' : 'hire me'}
                    </button>
                  </div>
                </div>
              ))}

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

export default HireAHelpr;
