import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { AiOutlineWarning, AiOutlineCalendar, AiOutlineDollar, AiOutlineStar } from 'react-icons/ai';
import { Snackbar, CircularProgress } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import moment from 'moment';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import PaymentDialog from './PaymentDialog.jsx';
import './orderhistory.css';

const Alert = (props) => {
  return <MuiAlert elevation={6} variant='filled' {...props} />;
};

const stripePromise = loadStripe('pk_test_rUhciG1u70wRpYUMcKByTOr300pePAMaYK');
console.log('stripePromise: ', stripePromise);

const OrderHistory = () => {
  // SET INITIAL STATES
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.isLoggedIn);
  const userId = useSelector((state) => state.userId);
  const paymentDialogOpen = useSelector((state) => state.paymentDialogOpen);
  const [open, setOpen] = useState(false);
  const [alertType, setAlertType] = useState('');
  const [alertMsg, setAlertMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [statusChanged, setStatusChanged] = useState(false);
  const history = useHistory();

  // COMPONENT DID MOUNT
  useEffect(() => {
    getOrderHistory();
  }, [statusChanged]);

  // ON PAYMENTDIALOGOPEN STATE CHANGE
  useEffect(() => {
    if (paymentDialogOpen) {
      document.body.style.overflow = 'hidden';
      return;
    }
    if (!paymentDialogOpen) {
      document.body.style.overflow = 'unset';
      return;
    }
  }, [paymentDialogOpen]);

  // GET ORDERS
  const getOrderHistory = async () => {
    console.log('getting orders');
    setIsLoading(true);

    const data = new FormData();
    data.append('userId', userId);

    const response = await fetch('/getOrderHistory', { method: 'POST', body: data });
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
  const accountRequired = 'You must be logged in to hire a helpr.';
  const paymentOpen = 'Only one order window can be open at a time.';

  // CONST HANDLE ORDER ACTION BUTTON PRESS
  const handleOrderAction = async (orderId, action) => {
    if (isLoggedIn === false) return toggleAlert(accountRequired, 'warning');
    if (paymentDialogOpen) return toggleAlert(paymentOpen, 'warning');

    if (action === 'complete') {
      const order = orders.filter((order) => order._id === orderId);
      console.log('order: ', order);
      dispatch({ type: 'orderToPay', payload: order });
      dispatch({ type: 'togglePaymentDialog' });
      return;
    }

    if (action === 'rate') {
      console.log('rate helpr');
      return;
    }

    // const data = new FormData();
    // data.append('orderId', orderId);
    // data.append('newStatus', action);

    // try {
    //   const response = await fetch('/updateOrderStatus', { method: 'POST', body: data });
    //   let body = await response.text();
    //   body = JSON.parse(body);
    //   const result = body.payload;

    //   if (body.success === false) {
    //     console.log('Failed to update order status.');
    //     toggleAlert(body.message, 'error');
    //     return;
    //   }

    //   console.log('status updated successfully');
    //   setStatusChanged(true);
    //   toggleAlert(body.message, 'success');
    //   return;
    // } catch (err) {
    //   console.log('Error trying to update state');
    //   return;
    // }
  };

  return (
    <>
      {paymentDialogOpen && (
        <Elements stripe={stripePromise}>
          <PaymentDialog />
        </Elements>
      )}
      {!isLoggedIn && history.push('/')}
      <section className='orderHistory' id='top'>
        <div className='content container'>
          <div className='formWrapper'>
            <div className='orderHistoryIcon'>
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
                      {order.status === 'pending payment' && (
                        <button className='button primary' onClick={() => handleOrderAction(order._id, 'complete')}>
                          <AiOutlineDollar /> Pay
                        </button>
                      )}
                      {order.status === 'complete' && (
                        <button className='button tertiary' onClick={() => handleOrderAction(order._id, 'rate')}>
                          <AiOutlineStar /> Rate
                        </button>
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

export default OrderHistory;
