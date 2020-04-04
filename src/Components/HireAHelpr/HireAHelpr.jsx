import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useHistory } from 'react-router-dom';
import { AiOutlineLock, AiOutlineLogin, AiOutlineWarning } from 'react-icons/ai';
import { Snackbar, CircularProgress } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import './hireahelpr.css';

const Alert = (props) => {
  return <MuiAlert elevation={6} variant='filled' {...props} />;
};

const HireAHelpr = () => {
  // SET INITIAL STATES
  const [open, setOpen] = useState(false);
  const [alertType, setAlertType] = useState('');
  const [alertMsg, setAlertMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();
  const [isChecked, setIsChecked] = useState(['searchOptions']);
  const [notChecked, setNotChecked] = useState([
    'plantr',
    'mowr',
    'rakr',
    'plowr',
    'North Shore',
    'South Shore',
    'Laval',
    'Montreal',
    'Longueuil',
  ]);

  // ON COMPONENT DID MOUNT
  useEffect(() => {}, []);

  // TOGGLE CHECKED BOXES
  const toggleChecked = (e) => {
    const type = e.target.name;
    console.log('toggling: ', type);

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

  // FORM HANDLERS
  const { register, handleSubmit, errors, setError, clearError } = useForm();
  const onSubmit = async (field) => {};

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
              checked={isChecked.includes('searchOptions') && 'checked'}
              onChange={(e) => toggleChecked(e)}
            />
            <label htmlFor='searchOptions' className={isChecked.includes('searchOptions') ? 'isOpen' : ''}>
              <div className='s1'></div>
              <div className='s2'></div>
            </label>
          </div>
          <div className={isChecked.includes('searchOptions') ? 'searchOptions' : 'searchOptions closed'}>
            <div className='helprTypesWrapper'>
              <div className='subheader'>Choose helpr types</div>
              <div className='helprTypes'>
                <input
                  type='checkbox'
                  id='plantrBox'
                  name='plantr'
                  checked={isChecked.includes('plantr') && 'checked'}
                  onChange={(e) => toggleChecked(e)}
                />
                <label htmlFor='plantrBox'>
                  <img
                    title='Show/Hide plantrs'
                    src='/imgs/icoPlantr.jpg'
                    className={isChecked.includes('plantr') ? 'helprIco' : 'helprIco disabled'}
                  />
                </label>
                <input
                  type='checkbox'
                  id='mowrBox'
                  name='mowr'
                  checked={isChecked.includes('mowr') && 'checked'}
                  onChange={(e) => toggleChecked(e)}
                />
                <label htmlFor='mowrBox'>
                  <img
                    title='Show/Hide mowrs'
                    src='/imgs/icoMowr.jpg'
                    className={isChecked.includes('mowr') ? 'helprIco' : 'helprIco disabled'}
                  />
                </label>
                <input
                  type='checkbox'
                  id='rakrBox'
                  name='rakr'
                  checked={isChecked.includes('rakr') && 'checked'}
                  onChange={(e) => toggleChecked(e)}
                />
                <label htmlFor='rakrBox'>
                  <img
                    title='Show/Hide rakrs'
                    src='/imgs/icoRakr.jpg'
                    className={isChecked.includes('rakr') ? 'helprIco' : 'helprIco disabled'}
                  />
                </label>
                <input
                  type='checkbox'
                  id='plowrBox'
                  name='plowr'
                  checked={isChecked.includes('plowr') && 'checked'}
                  onChange={(e) => toggleChecked(e)}
                />
                <label htmlFor='plowrBox'>
                  <img
                    title='Show/Hide plowrs'
                    src='/imgs/icoPlowr.jpg'
                    className={isChecked.includes('plowr') ? 'helprIco' : 'helprIco disabled'}
                  />
                </label>
              </div>
            </div>

            <div className='helprLocationsWrapper'>
              <div className='subheader'>Choose helpr locations</div>
              <div className='helprLocations'>
                <div className={isChecked.includes('North Shore') ? 'pill tertiary checked' : 'pill tertiary'}>
                  <input type='checkbox' name='North Shore' id='northShore' onChange={(e) => toggleChecked(e)} />
                  <label htmlFor='northShore'>North Shore</label>
                </div>
                <div className={isChecked.includes('South Shore') ? 'pill tertiary checked' : 'pill tertiary'}>
                  <input type='checkbox' name='South Shore' id='southShore' onChange={(e) => toggleChecked(e)} />
                  <label htmlFor='southShore'>South Shore</label>
                </div>
                <div className={isChecked.includes('Laval') ? 'pill tertiary checked' : 'pill tertiary'}>
                  <input type='checkbox' name='Laval' id='laval' onChange={(e) => toggleChecked(e)} />
                  <label htmlFor='laval'>Laval</label>
                </div>
                <div className={isChecked.includes('Montreal') ? 'pill tertiary checked' : 'pill tertiary'}>
                  <input type='checkbox' name='Montreal' id='montreal' onChange={(e) => toggleChecked(e)} />
                  <label htmlFor='montreal'>Montreal</label>
                </div>
                <div className={isChecked.includes('Longueuil') ? 'pill tertiary checked' : 'pill tertiary'}>
                  <input type='checkbox' name='Longueuil' id='longueuil' onChange={(e) => toggleChecked(e)} />
                  <label htmlFor='longueuil'>Longueuil</label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HireAHelpr;
