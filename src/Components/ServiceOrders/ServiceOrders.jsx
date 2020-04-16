import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import {
  AiOutlineCheckCircle,
  AiOutlineCloseCircle,
  AiOutlineWarning,
  AiOutlineCalendar,
  AiOutlineDollar,
} from 'react-icons/ai';
import { Snackbar, CircularProgress } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import moment from 'moment';
import './serviceorders.css';

const Alert = (props) => {
  return <MuiAlert elevation={6} variant='filled' {...props} />;
};

const ServiceOrders = () => {
  // SET INITIAL STATES
  const isLoggedIn = useSelector((state) => state.isLoggedIn);
  const isHelpr = useSelector((state) => state.isHelpr);
  const helprId = useSelector((state) => state.userId);
  const [open, setOpen] = useState(false);
  const [alertType, setAlertType] = useState('');
  const [alertMsg, setAlertMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [statusChanged, setStatusChanged] = useState(false);
  const history = useHistory();

  // COMPONENT DID MOUNT
  useEffect(() => {
    getOrders();
  }, [statusChanged]);

  // GET ORDERS
  const getOrders = async () => {
    console.log('getting orders');
    setIsLoading(true);

    const data = new FormData();
    data.append('helprId', helprId);

    const response = await fetch('/getOrders', { method: 'POST', body: data });
    let body = await response.text();
    body = JSON.parse(body);
    const orders = body.payload;

    console.log('orders: ', orders);

    if (body.success === false) {
      console.log('failed to retreive orders.');
      setIsLoading(false);
      toggleAlert(body.message, 'error');
      return;
    }

    setOrders(orders);
    setIsLoading(false);
    return;
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
    if (alertType === 'success') {
      setIsLoading(false);
      setStatusChanged(false);
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
  const loggedIn = 'You must be logged in to view this page.';

  // ERROR HANDLER
  const errorMessage = (error) => {
    return (
      <div className='error'>
        <AiOutlineWarning /> {error}
      </div>
    );
  };

  // HANDLE BUTTON TEXT
  const getBtnText = (action) => {
    if (action === 'accept') {
      return (
        <>
          <AiOutlineCheckCircle /> Accept
        </>
      );
    }
    if (action === 'bill') {
      return (
        <>
          <AiOutlineDollar /> Bill
        </>
      );
    }
    if (action === 'reject') {
      return (
        <>
          <AiOutlineCloseCircle /> Reject
        </>
      );
    }
  };

  // CONST HANDLE ORDER ACTION BUTTON PRESS
  const handleOrderAction = async (orderId, action) => {
    console.log('handling order action click');

    const data = new FormData();
    data.append('orderId', orderId);
    data.append('newStatus', action);

    try {
      const response = await fetch('/updateOrderStatus', { method: 'POST', body: data });
      let body = await response.text();
      body = JSON.parse(body);
      const result = body.payload;

      if (body.success === false) {
        console.log('Failed to update order status.');
        toggleAlert(body.message, 'error');
        return;
      }

      console.log('status updated successfully');
      setStatusChanged(true);
      toggleAlert(body.message, 'success');
      return;
    } catch (err) {
      console.log('Error trying to update state');
      return;
    }
  };

  return (
    <>
      {!isLoggedIn && history.push('/')}
      <section className='serviceOrders' id='top'>
        <div className='content container'>
          <div className='formWrapper'>
            <div className='serviceOrdersIcon'>
              <AiOutlineCalendar />
            </div>

            <div className='ordersContainer'>
              <div className='order'>
                <div className='subheader'>Order #</div>
                <div className='subheader'>Status</div>
                <div className='subheader'>Service Date</div>
                <div className='subheader'>Service Type</div>
                <div className='subheader'>SQFT</div>
                <div className='subheader'>Order Total</div>
                <div className='subheader'>actions</div>
              </div>

              {isLoading && (
                <div className='nohelprs'>
                  <CircularProgress variant='indeterminate' size='4rem' />
                </div>
              )}

              {orders.length === 0 && (
                <div className='subheader nohelprs'>
                  <AiOutlineWarning /> No orders found.
                </div>
              )}

              {orders.length >= 0 &&
                orders.map((order) => (
                  <div className='order' key={Math.floor(Math.random() * 10000000000)}>
                    <div className='orderDetails'>{order._id.substring(0, 10)}</div>
                    <div className='orderDetails'>{order.status}</div>
                    <div className='orderDetails'>{moment(order.date._i).format('DD-MM-YY hh:mm A')}</div>
                    <div className={'orderDetails static ' + order.serviceType}>{order.serviceType}</div>
                    <div className='orderDetails'>{order.sqft}</div>
                    <div className='orderDetails'>${order.orderTotal}</div>
                    <div className='orderDetails orderActions'>
                      {order.status === 'pending' && (
                        <>
                          <button className='button primary' onClick={() => handleOrderAction(order._id, 'accepted')}>
                            {getBtnText('accept')}
                          </button>
                          <button className='button tertiary' onClick={() => handleOrderAction(order._id, 'rejected')}>
                            {getBtnText('reject')}
                          </button>
                        </>
                      )}
                      {order.status === 'accepted' && (
                        <>
                          <button
                            className='button alt'
                            onClick={() => handleOrderAction(order._id, 'pending payment')}
                          >
                            {getBtnText('bill')}
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
            </div>

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

export default ServiceOrders;
