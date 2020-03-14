const express = require('express');
const app = express();
const multer = require('multer');
const upload = multer({ dest: __dirname + '/uploads' });
const sha1 = require('sha1');
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const ObjectId = mongodb.ObjectID;
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const reloadMagic = require('./reload-magic.js');

reloadMagic(app);
app.use(cookieParser());
dotenv.config();

const sessions = {};
let db = undefined;
let url = process.env.MONGODB_URL;
MongoClient.connect(url, { useUnifiedTopology: true })
  .then(client => {
    db = client.db('helpr');
  })
  .catch(err => console.log(err));

// FOLDER END POINTS
app.use('/', express.static('build')); // Needed for the HTML and JS files
app.use('/', express.static('public')); // Needed for local assets
app.use('/uploads', express.static('uploads')); // Needed for uploaded images

// SIGN UP END POINT
app.post('/sign-up', upload.none(), async (req, res) => {
  console.log('sign-up end point entered');
  const body = req.body;
  const isHelpr = body.isHelpr;
  const email = body.email;
  const password = body.password;

  try {
    // HELPR SIGN-UP
    if (isHelpr) {
      console.log('helpr sign up');
      const helpr = await db.collection('helprs').findOne({ email: email });
      if (helpr) {
        console.log('Account already exists.');
        res.send(JSON.stringify({ success: false, message: 'Account already exists.' }));
        return;
      }
      await db.collection('helprs').insertOne({
        email: email,
        password: sha1(password),
        firstName: body.firstName,
        lastName: body.lastName,
        phoneNumber: body.phoneNumber,
        address: body.address,
        city: body.city,
        postalCode: body.postalCode,
        rate: body.rate,
        rating: body.rating,
        profileImg: body.profileImg,
        serviceLocations: body.serviceLocations,
        serviceTypes: body.serviceTypes
      });
      const sid = Math.floor(Math.random() * 10000000000);
      sessions[sid] = email;
      res.cookie('isHelpr', isHelpr);
      res.cookie('sid', sid);
      console.log('cookie dropped with sid: ', sid + ', isHelpr: ' + isHelpr);
      res.send(JSON.stringify({ success: true, message: 'Account created successfully.' }));
      return;
    }

    // USER SIGN-UP
    if (!isHelpr) {
      console.log('user sign up');
      const user = await db.collection('users').findOne({ email: email });
      if (user) {
        console.log('Account already exists.');
        res.send(JSON.stringify({ success: false, message: 'Account already exists.' }));
        return;
      }
      await db.collection('users').insertOne({
        email: email,
        password: sha1(password),
        firstName: body.firstName,
        lastName: body.lastName,
        phoneNumber: body.phoneNumber,
        address: body.address,
        city: body.city,
        postalCode: body.postalCode,
        serviceTypes: body.serviceTypes
      });
      const sid = Math.floor(Math.random() * 10000000000);
      sessions[sid] = email;
      res.cookie('isHelpr', isHelpr);
      res.cookie('sid', sid);
      console.log('cookie dropped with sid: ', sid + ', isHelpr: ' + isHelpr);
      res.send(JSON.stringify({ success: true, message: 'Account created successfully.' }));
      return;
    }
  } catch (err) {
    console.log('/sign-up error: ', err);
    res.send(
      JSON.stringify({ success: false, message: 'An error occured when attempting to sign-up, please try again.' })
    );
    return;
  }
});

// LOGIN END POINT
app.post('/login', upload.none(), async (req, res) => {
  console.log('/login end point entered');
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
      console.log('Helpr login successful');
      res.send(JSON.stringify({ success: true, message: 'Login successful.', isHelpr: true }));
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
      console.log('user login successful');
      res.send(JSON.stringify({ success: true, message: 'Login successful.', isHelpr: false }));
      return;
    }

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

// REACT ROUTER SETUP
app.all('/*', (req, res, next) => {
  // needed for react router
  res.sendFile(__dirname + '/build/index.html');
});

// START SERVER
app.listen(4000, '0.0.0.0', () => {
  console.log('Server running on port 4000');
});
