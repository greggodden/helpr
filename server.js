const express = require('express');
const app = express();
const multer = require('multer');
const upload = multer({ dest: __dirname + '/uploads' });
const sha1 = require('sha1');
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const ObjectId = mongodb.ObjectID;
const cookieParser = require('cookie-parser');
const reloadMagic = require('./reload-magic.js');
const moment = require('moment');

reloadMagic(app);
app.use(cookieParser());
require('dotenv').config();
moment().format();

const stripe = require('stripe')(process.env.STRIPE_KEY);

const sessions = {};
let db = undefined;
let url = process.env.MONGODB_URL;
MongoClient.connect(url, { useUnifiedTopology: true })
  .then((client) => {
    db = client.db('helpr');
  })
  .catch((err) => console.log(err));

// ******************************
// FOLDER END POINTS
// ******************************
app.use('/', express.static('build')); // Needed for the HTML and JS files
app.use('/', express.static('public')); // Needed for local assets
app.use('/uploads', express.static('uploads')); // Needed for uploaded images

// ******************************
// CHECK FOR OPEN SESSION (LOGGED IN)
// ******************************
checkSession = (sid) => {
  console.log('Checking session for sid: ', sid);
  if (!sessions[sid]) {
    console.log('ERROR: Session ID does not exist.');
    JSON.stringify({ success: false, message: 'Please login and try again.' });
    return;
  }
};

// ******************************
// SIGN UP END POINT
// ******************************
app.post('/sign-up', upload.none(), async (req, res) => {
  console.log('********** /SIGN-UP END POINT ENTERED **********');
  const body = req.body;
  const isHelpr = body.isHelpr;
  const email = body.email;
  const password = body.password;
  console.log('sign up isHelpr: ', isHelpr);

  // *************
  // HELPR SIGN-UP
  // *************
  if (isHelpr === 'true') {
    try {
      console.log('helpr sign up');
      const helpr = await db.collection('helprs').findOne({ email: email });

      if (helpr) {
        console.log('Account already exists.');
        res.send(JSON.stringify({ success: false, message: 'Account already exists.' }));
        return;
      }

      const newHelpr = {
        email: email,
        password: sha1(password),
        firstName: body.firstName,
        lastName: body.lastName,
        phoneNumber: body.phoneNumber,
        address: body.address,
        city: body.city,
        postalCode: body.postalCode,
        rating: 0,
        profileImg: undefined,
        serviceLocations: body.serviceLocations.split(','),
        serviceTypes: body.serviceTypes.split(','),
        serviceRates: [{ plantr: 0 }, { mowr: 0 }, { rakr: 0 }, { plowr: 0 }],
      };
      console.log('newHelpr: ', newHelpr);

      const result = await db.collection('helprs').insertOne(newHelpr);
      const helprId = await result.insertedId;

      const sid = Math.floor(Math.random() * 10000000000);
      sessions[sid] = email;
      res.cookie('helprId', helprId);
      res.cookie('isHelpr', isHelpr);
      res.cookie('sid', sid);
      console.log('cookie dropped with sid: ', sid + ', isHelpr: ' + isHelpr + ', helprId: ' + helprId);
      res.send(JSON.stringify({ success: true, message: 'Account created successfully.', id: helprId }));
      return;
    } catch (err) {
      console.log('failed to insert record into helprs collection.');
      res.send(JSON.stringify({ success: false, message: 'Failed to create account, please try again.' }));
      return;
    }
  }

  // ************
  // USER SIGN-UP
  // ************
  if (isHelpr !== 'true') {
    try {
      console.log('user sign up');
      const user = await db.collection('users').findOne({ email: email });

      if (user) {
        console.log('Account already exists.');
        res.send(JSON.stringify({ success: false, message: 'Account already exists.' }));
        return;
      }

      const newUser = {
        email: email,
        password: sha1(password),
        firstName: body.firstName,
        lastName: body.lastName,
        phoneNumber: body.phoneNumber,
        address: body.address,
        city: body.city,
        postalCode: body.postalCode,
        serviceTypes: body.serviceTypes.split(','),
      };

      const result = await db.collection('users').insertOne(newUser);
      const userId = await result.insertedId;

      const sid = Math.floor(Math.random() * 10000000000);
      sessions[sid] = email;
      res.cookie('userId', userId);
      res.cookie('isHelpr', isHelpr);
      res.cookie('sid', sid);
      console.log('cookie dropped with sid: ', sid + ', isHelpr: ' + isHelpr + ', userId: ' + userId);
      res.send(JSON.stringify({ success: true, message: 'Account created successfully.', id: userId }));
      return;
    } catch (err) {
      console.log('failed to insert record into users collection.');
      res.send(JSON.stringify({ success: false, message: 'Failed to create account, please try again.' }));
      return;
    }
  }
});

// ******************************
// LOGIN END POINT
// ******************************
app.post('/login', upload.none(), async (req, res) => {
  console.log('********** /LOGIN END POINT ENTERED **********');
  const body = req.body;
  const emailInput = body.emailInput;
  const passwordInput = sha1(body.passwordInput);
  console.log('user inputs - email: ' + emailInput + ' password: ' + sha1(passwordInput));

  try {
    const helpr = await db.collection('helprs').findOne({ email: emailInput });
    if (helpr) {
      console.log('helpr login attempt: ', helpr);

      if (passwordInput !== helpr.password) {
        console.log('Helpr Failed to login - Invalid Password');
        res.send(JSON.stringify({ success: false, message: 'Login failed, please try again.' }));
        return;
      }

      console.log('Helpr login successful - helprId: ' + helpr._id);
      const sid = Math.floor(Math.random() * 10000000000);
      sessions[sid] = emailInput;
      res.cookie('helprId', helpr._id);
      res.cookie('isHelpr', true);
      res.cookie('sid', sid);
      console.log('cookie dropped with sid: ', sid + ', isHelpr: ' + true + ', helprId: ' + helpr._id);
      res.send(JSON.stringify({ success: true, message: 'Login successful.', isHelpr: true, id: helpr._id }));
      return;
    }

    const user = await db.collection('users').findOne({ email: emailInput });
    if (user) {
      console.log('user login attempt: ', user);

      if (passwordInput !== user.password) {
        console.log('user Failed to login - Invalid Password');
        res.send(JSON.stringify({ success: false, message: 'Login failed, please try again.' }));
        return;
      }

      console.log('user login successful - userId: ' + user._id);
      const sid = Math.floor(Math.random() * 10000000000);
      sessions[sid] = emailInput;
      res.cookie('userId', user._id);
      res.cookie('isHelpr', false);
      res.cookie('sid', sid);
      console.log('cookie dropped with sid: ', sid + ', isHelpr: ' + false + ', userId: ' + user._id);
      res.send(JSON.stringify({ success: true, message: 'Login successful.', isHelpr: false, id: user._id }));
      return;
    }

    console.log('account does not exist.');
    res.send(JSON.stringify({ success: false, message: 'Account does not exist.' }));
    return;
  } catch (err) {
    console.log('/login error: ', err);
    res.send(
      JSON.stringify({ success: false, message: 'An error occured when attempting to login, please try again.' })
    );
    return;
  }
});

// ******************************
// GET HELPR DATA END POINT - RETURN DATA FOR 1 HELPR
// ******************************
app.post('/getData', upload.none(), async (req, res) => {
  console.log('********** /getDATA END POINT ENTERED **********');

  const sid = req.cookies.sid;
  checkSession(sid);

  const body = req.body;
  const helprId = body._id;

  try {
    const helprData = await db.collection('helprs').findOne({ _id: ObjectId(helprId) });

    if (!helprData) {
      console.log('No matching helpr found.');
      res.send(JSON.stringify({ success: false, message: 'No matching helpr found.' }));
      return;
    }

    console.log('helprData retrieved successfully: ', helprData);
    res.send(JSON.stringify({ sucess: true, message: 'helpr data retreieve successfully.', payload: helprData }));
    return;
  } catch (err) {
    console.log('/gatData error: ', err);
    res.send(
      JSON.stringify({
        success: false,
        message: 'An error occured when attempting to retrieve user data. Please try again.',
      })
    );
    return;
  }
});

// ******************************
// HELPR SETTINGS END POINT
// ******************************
app.post('/helprSettings', upload.single('profileImg'), async (req, res) => {
  console.log('********** /helprSETTINGS END POINT ENTERED **********');

  const sid = req.cookies.sid;
  checkSession(sid);

  const body = req.body;
  const file = req.file;
  const helprId = body._id;
  const serviceTypes = body.serviceTypes.split(',');
  const plantrRate = { plantr: JSON.parse(body.plantrRate) };
  const mowrRate = { mowr: JSON.parse(body.mowrRate) };
  const rakrRate = { rakr: JSON.parse(body.rakrRate) };
  const plowrRate = { plowr: JSON.parse(body.plowrRate) };
  const serviceRates = [plantrRate, mowrRate, rakrRate, plowrRate];
  const serviceLocations = body.serviceLocations.split(',');
  let profileImg = '';
  if (file) {
    profileImg = '/uploads/' + file.filename;
  }
  if (!file) {
    profileImg = '/uploads/defaultProfileImg.png';
  }

  try {
    const matchId = { _id: ObjectId(helprId) };
    const newValues = {
      $set: {
        serviceTypes: serviceTypes,
        serviceRates: serviceRates,
        serviceLocations: serviceLocations,
        profileImg: profileImg,
      },
    };
    const response = await db.collection('helprs').updateOne(matchId, newValues, (err, res) => {
      if (err) {
        console.log('Error: ', err);
        res.send(JSON.stringify({ success: false, message: 'Failed to update records.' }));
        return;
      }
      console.log('Inner Updated Response: ', res);
    });
    console.log('response: ', response);
  } catch (err) {
    console.log('/helprSettings Error: ', err);
    res.send(JSON.stringify({ success: false, message: 'An error occured while saving settings, please try again.' }));
    return;
  }

  console.log('Settings saved successfully.');
  res.send(JSON.stringify({ success: true, message: 'Settings saved successfully.' }));
  return;
});

// ******************************
// GET HELPRS END POINT - RETURNS ALL HELPRS
// ******************************
app.post('/getHelprs', upload.none(), async (req, res) => {
  console.log('********** /getHelprs END POINT ENTERED **********');

  const allLocations = ['North Shore', 'South Shore', 'Laval', 'Montreal', 'Longueuil'];
  const allTypes = ['plantr', 'mowr', 'rakr', 'plowr'];

  const body = req.body;
  const criteria = body.criteria;

  // BUILD SEARCH CRITERIA
  const serviceLocations = allLocations.filter((loc) => {
    if (criteria.includes(loc)) return loc;
  });

  const serviceTypes = allTypes.filter((type) => {
    if (criteria.includes(type)) return type;
  });

  // CONNECT TO DB TO RETREIVE HELPRS
  try {
    const query = { serviceLocations: { $in: serviceLocations }, serviceTypes: { $in: serviceTypes } };
    const response = await db.collection('helprs').find(query).toArray();

    if (!response || response.length === 0) {
      console.log('No helprs found.');
      res.send(JSON.stringify({ success: false, message: 'No helprs found' }));
      return;
    }

    console.log('Retreieved helprs successfully.');
    res.send(JSON.stringify({ success: true, message: 'Helprs loaded successfully.', payload: response }));
    return;
  } catch (err) {
    console.log('/getHelprs error', err);
    res.send(JSON.stringify({ success: false, message: 'Error loading helprs.' }));
    return;
  }
});

// ******************************
// GET USER DATA END POINT - RETURN DATA FOR 1 USER
// ******************************
app.post('/getUserData', upload.none(), async (req, res) => {
  console.log('********** /getUserDATA END POINT ENTERED **********');

  const sid = req.cookies.sid;
  checkSession(sid);

  const body = req.body;
  const userId = body._id;

  try {
    const userData = await db.collection('users').findOne({ _id: ObjectId(userId) });

    if (!userData) {
      console.log('No matching user found.');
      res.send(JSON.stringify({ success: false, message: 'No matching user found.' }));
      return;
    }

    console.log('userData retrieved successfully: ', userData);
    res.send(JSON.stringify({ sucess: true, message: 'user data retreieved successfully.', payload: userData }));
    return;
  } catch (err) {
    console.log('/gatUserData error: ', err);
    res.send(
      JSON.stringify({
        success: false,
        message: 'An error occured when attempting to retrieve user data. Please try again.',
      })
    );
    return;
  }
});

// ******************************
// BOOK A HELPR END POINT
// ******************************
app.post('/bookHelpr', upload.none(), async (req, res) => {
  console.log('********** /bookHelpr END POINT ENTERED **********');

  const sid = req.cookies.sid;
  checkSession(sid);

  const body = req.body;
  const data = {
    userId: body.userId,
    helprId: body.helprId,
    status: 'pending',
    serviceType: body.serviceType,
    rate: Number(body.rate),
    date: moment(body.date, 'DD-MM-YY hh:mm A'),
    sqft: Number(body.sqft),
    serviceCharge: Number(body.serviceCharge),
    orderTotal: Math.round(Number(body.orderTotal).toFixed(2)),
    firstName: body.firstName,
    lastName: body.lastName,
    phoneNumber: body.phoneNumber,
    address: body.address,
    city: body.city,
    postalCode: body.postalCode,
  };

  try {
    const response = await db.collection('orders').insertOne(data);
    const orderId = await response.insertedId;

    if (!orderId) {
      console.log('Error requesting service.');
      res.send(JSON.stringify({ success: false, message: 'Error requesting service.' }));
      return;
    }

    console.log('Service request submitted successfully.');
    res.send(
      JSON.stringify({
        success: true,
        message: 'Service request submitted. Please allow 24-48 hours for processing.',
        payload: orderId,
      })
    );
    return;
  } catch (err) {
    console.log('Error in bookHelpr', err);
    res.send(JSON.stringify({ success: false, message: 'Failed to request service.' }));
    return;
  }
});

// ******************************
// GET ORDERS END POINT - RETRIEVES ALL ORDERS FOR 1 HELPR
// ******************************
app.post('/getOrders', upload.none(), async (req, res) => {
  console.log('********** /getOrders END POINT ENTERED **********');

  const sid = req.cookies.sid;
  checkSession(sid);

  const body = req.body;
  const helprId = body.helprId;
  const query = { helprId: helprId };

  try {
    const response = await db.collection('orders').find(query).toArray();

    if (!response || response.length === 0) {
      console.log('No orders found.');
      res.send(JSON.stringify({ success: false, message: 'No orders found.' }));
      return;
    }

    console.log('retrieved orders successfully');
    res.send(JSON.stringify({ success: true, message: 'Successfully retrieved orders.', payload: response }));
    return;
  } catch (err) {
    console.log('/getOrders Error', err);
    res.send(JSON.stringify({ success: false, message: 'Failed to retreive orders.' }));
    return;
  }
});

// ******************************
// UPDATE THE STATE OF 1 ORDER
// ******************************
app.post('/updateOrderStatus', upload.none(), async (req, res) => {
  console.log('********** /updateOrderStatus END POINT ENTERED **********');

  const sid = req.cookies.sid;
  checkSession(sid);

  const body = req.body;
  console.log('body: ', body);

  const orderId = body.orderId;
  const newStatus = body.newStatus;
  const matchId = { _id: ObjectId(orderId) };
  const newValues = {
    $set: {
      status: newStatus,
    },
  };

  try {
    const response = await db.collection('orders').updateOne(matchId, newValues);
    const result = await response.result;

    if (result.n === 0) {
      console.log('No matching orders found.');
      res.send(JSON.stringify({ success: false, message: 'Failed to update order status.' }));
      return;
    }

    console.log('Order status updated successfully.');
    res.send(JSON.stringify({ success: true, message: 'Order status updated successfully.', payload: result }));
    return;
  } catch (err) {
    console.log('Failed to update order status.');
    res.send(JSON.stringify({ success: false, message: 'Failed to update order status.' }));
    return;
  }
});

// ******************************
// GET ORDER HISTORY END POINT - RETRIEVES ALL ORDER HISTORY FOR 1 USER
// ******************************
app.post('/getOrderHistory', upload.none(), async (req, res) => {
  console.log('********** /getOrders END POINT ENTERED **********');

  const sid = req.cookies.sid;
  checkSession(sid);

  const body = req.body;
  const userId = body.userId;
  const query = { userId: userId };

  try {
    const orders = await db.collection('orders').find(query).toArray();
    console.log('response: ', orders);

    if (!orders || orders.length === 0) {
      console.log('No orders found.');
      res.send(JSON.stringify({ success: false, message: 'No orders found.' }));
      return;
    }

    console.log('retrieved orders successfully');
    res.send(JSON.stringify({ success: true, message: 'Successfully retrieved orders.', payload: orders }));
    return;
  } catch (err) {
    console.log('/getOrderHistory Error', err);
    res.send(JSON.stringify({ success: false, message: 'Failed to retreive orders.' }));
    return;
  }
});

//*******************************
// GENERATE PAYMENT INTENT
//*******************************
app.post('/getIntent', upload.none(), async (req, res) => {
  console.log('********** /getIntent END POINT ENTERED **********');

  const sid = req.cookies.sid;
  checkSession(sid);

  const body = req.body;
  const total = Math.round(Number.parseFloat(body.orderTotal).toFixed(2) * 100);
  console.log('body:', body);

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: total,
      currency: 'cad',
      metadata: { integration_check: 'accept_a_payment', orderID: body.orderId },
    });

    if (!paymentIntent) {
      console.log('Failed to generate payment intent.');
      res.send(JSON.stringify({ success: false, message: 'Failed to generate payment intent.' }));
      return;
    }

    console.log('Payment intent generated successfully.');
    res.send(
      JSON.stringify({ success: true, message: 'Payment intent generated successfully.', payload: paymentIntent })
    );
    return;
  } catch (err) {
    console.log('/getIntent error: ', err);
    res.send(JSON.stringify({ succesS: false, message: err }));
    return;
  }
});

// ******************************
// REACT ROUTER SETUP
// ******************************
app.all('/*', (req, res, next) => {
  // needed for react router
  res.sendFile(__dirname + '/build/index.html');
});

// ******************************
// START SERVER
// ******************************
app.listen(4000, '0.0.0.0', () => {
  console.log('Server running on port 4000');
});
