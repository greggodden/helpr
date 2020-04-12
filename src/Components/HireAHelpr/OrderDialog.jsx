import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { Link, useHistory } from 'react-router-dom';
import { AiOutlineCalendar, AiOutlineWarning, AiOutlineTool } from 'react-icons/ai';
import { Snackbar, CircularProgress, createMuiTheme } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import { KeyboardDateTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import { ThemeProvider } from '@material-ui/styles';
import MomentUtils from '@date-io/moment';
import './orderdialog.css';

const calendarTheme = createMuiTheme({
  palette: {
    primary: {
      main: '#ff2e63',
    },
  },
});

const Alert = (props) => {
  return <MuiAlert elevation={6} variant='filled' {...props} />;
};

const OrderDialog = () => {
  // SET INITIAL STATES
  const dispatch = useDispatch();
  const history = useHistory();
  const isLoggedIn = useSelector((state) => state.isLoggedIn);
  const isHelpr = useSelector((state) => state.isHelpr);
  const orderDialogOpen = useSelector((state) => state.toggleOrderDialog);
  const helprToHire = useSelector((state) => state.helprToHire);
  const [open, setOpen] = useState(false);
  const [alertType, setAlertType] = useState('');
  const [alertMsg, setAlertMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isChecked, setIsChecked] = useState([]);
  const [notChecked, setNotChecked] = useState(['plantr', 'mowr', 'rakr', 'plowr']);
  const [selectedDate, handleDateChange] = useState(new Date());

  // TOGGLE CHECKED BOXES
  const toggleChecked = (e) => {
    console.log('toggling checked, ', e.target.name);
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

  // CLOSE ALERT
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    if (reason === 'orderDialog') {
      dispatch({ type: 'toggleOrderDialog' });
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

  // HANDLE BUTTON TEXT
  const getBtnText = () => {
    if (!isLoading) {
      return (
        <>
          <AiOutlineTool /> Request Service
        </>
      );
    }
    return <CircularProgress variant='indeterminate' size='1rem' />;
  };

  // FORM HANDLERS
  const { register, handleSubmit, errors } = useForm();
  const onSubmit = async (field) => {};

  // ERROR MESSAGES
  const accountRequired = 'You must be logged in to hire a helpr.';
  const noHelprs = 'helprs cannot hire helprs, please sign-up or login to a user account.';

  //ERROR HANDLER
  const errorMessage = (error) => {
    return (
      <div className='error'>
        <AiOutlineWarning /> {error}
      </div>
    );
  };

  const getRate = (type) => {
    const result = helprToHire.serviceRates.find((rate) => {
      const servType = Object.getOwnPropertyNames(rate).toString();
      if (servType === type) return Number(rate[type]);
    });
    return result[type];
  };

  return (
    <section className='orderDialog'>
      <div className='content container'>
        <div className='formWrapper'>
          <div className='closeToggle'>
            <div className='isOpen' onClick={() => handleClose(null, 'orderDialog')}>
              <div className='s1'></div>
              <div className='s2'></div>
            </div>
          </div>

          <div className='orderContainer'>
            <div className='helprProfile col'>
              <div className='profileSection col'>
                <div>
                  <img
                    className='profileImg'
                    src={helprToHire.profileImg ? helprToHire.profileImg : '/uploads/defaultProfileImg.png'}
                  />
                </div>
                <div className='profileName'>
                  {helprToHire.firstName} {helprToHire.lastName}
                </div>
              </div>

              <hr />

              <div className='profileSection col profileDetails'>
                <div>{helprToHire.address}</div>
                <div>{helprToHire.city}</div>
                <div>{helprToHire.postalCode}</div>
                <div>{helprToHire.phoneNumber}</div>
              </div>

              <div className='profileSection row'>
                <a
                  href={'mailto:' + helprToHire.email + '?subject=Question%20from%20helpr.com'}
                  className='button tertiary'
                >
                  Contact <span className='lower'>helpr</span>
                </a>
              </div>
            </div>
            <div className='orderForm col'>
              <div className='orderIcon'>
                <AiOutlineCalendar />
              </div>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className='formSection row'>
                  <div className='formSection col'>
                    <div className='formDetails'>
                      <div className='subheader'>Select a service</div>
                      <div className='row'>
                        {helprToHire.serviceTypes.map((type) => (
                          <div
                            className={isChecked.includes(type) ? 'static ' + type + ' checked' : 'static ' + type}
                            key={Math.floor(Math.random() * 10000000000)}
                          >
                            <input
                              type='checkbox'
                              name={type}
                              id={type}
                              checked={isChecked.includes(type)}
                              onChange={toggleChecked}
                            />
                            <label htmlFor={type}>{type + ' ($' + getRate(type) + '/sqft)'}</label>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className='formDetails'>
                      <div className='subheader'>Select a date</div>
                      <div>
                        <MuiPickersUtilsProvider utils={MomentUtils}>
                          <ThemeProvider theme={calendarTheme}>
                            <KeyboardDateTimePicker
                              label='Calendar'
                              inputVariant='outlined'
                              showTodayButton
                              disablePast
                              value={selectedDate}
                              onChange={handleDateChange}
                              minutesStep={5}
                            />
                          </ThemeProvider>
                        </MuiPickersUtilsProvider>
                      </div>
                    </div>
                    <div className='formDetails'>
                      <div className='subheader'>Calculate cost</div>
                      <div>SQFT INPUT x $RATE + $SERVICE CHARGE</div>
                      <div>TOTAL COST</div>
                    </div>
                  </div>
                  <div className='formSection col'>INPUT FIELDS GO HERE</div>
                </div>
                <button className='button reverse' type='submit'>
                  {getBtnText()}
                </button>
              </form>
            </div>
          </div>

          <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
            <Alert onClose={handleClose} severity={alertType}>
              {alertMsg}
            </Alert>
          </Snackbar>
        </div>
      </div>
    </section>
  );
};

export default OrderDialog;
