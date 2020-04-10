import React, { useState, useEffect } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { AiOutlineWarning } from 'react-icons/ai';
import { Snackbar, CircularProgress } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import './hireahelpr.css';

const Alert = (props) => {
  return <MuiAlert elevation={6} variant='filled' {...props} />;
};

const HireAHelpr = () => {
  // SET INITIAL STATES
  const history = useHistory();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(true);
  const [alertType, setAlertType] = useState('');
  const [alertMsg, setAlertMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isChecked, setIsChecked] = useState(['plantr', 'mowr', 'rakr', 'plowr']);
  const [notChecked, setNotChecked] = useState(['North Shore', 'South Shore', 'Laval', 'Montreal', 'Longueuil']);
  const [helprs, setHelprs] = useState();

  // ON COMPONENT DID MOUNT
  useEffect(() => {
    getStartingLocations();
  }, []);

  // ON COMPONENT DID UPDATE
  useEffect(() => {
    getHelprs();
  }, [isChecked, notChecked]);

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

    console.log('body: ', body);
    setHelprs(body.payload);
    console.log('helprs: ', helprs);

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
      console.log(type + ' removed from isChecked & added to notChecked');
      return;
    }

    // ADD CHECKED TYPE
    if (e.target.checked && !isChecked.includes(type)) {
      setIsChecked((isChecked) => isChecked.concat(type));
      setNotChecked((notChecked) => notChecked.filter((name) => name !== type));
      console.log(type + ' added to isChecked & removed from notChecked');
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

  // ERROR MESSAGES
  const required = 'This field is required.';
  const maxLength = 'Input exeeds maximum length.';
  const pattern = 'Input format is not valid.';

  //ERROR HANDLER
  const errorMessage = (error) => {
    return (
      <div className='error'>
        <AiOutlineWarning /> {error}
      </div>
    );
  };

  return (
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

        {isLoading && <div className='nohelprs'><CircularProgress variant='indeterminate' size='4rem' /></div>}
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
                <div className='cardsection'>
                  {helpr.firstName} {helpr.lastName}
                </div>
                <div className='cardsection'>Service Locations</div>
                <div className='cardsection'>
                  {helpr.serviceLocations.forEach((loc) => (
                    <div className='pill'>{loc}</div>
                  ))}
                </div>
                <div className='cardsection'>
                  <button className='button alt'>hire now</button>
                </div>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
};

export default HireAHelpr;
