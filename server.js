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
  console.log('isHelpr is ', isHelpr);

  try {
    // HELPR SIGN-UP
    if (isHelpr === 'true') {
      console.log('helpr sign up');
      const user = await db.collection('helprs').findOne({ email: email });
      if (user) {
        return res.send(
          JSON.stringify({ success: false, message: 'An account already exists with this email address.' })
        );
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
      console.log('cookie dropped with sid: ', sid + ', helpr:' + isHelpr);
      res.send(JSON.stringify({ success: true, message: 'Account created successfully' }));
      return;
    }

    // USER SIGN-UP
    if (isHelpr === 'false') {
      console.log('user sign up');
      const user = await db.collection('users').findOne({ email: email });
      if (user) {
        return res.send(
          JSON.stringify({ success: false, message: 'An account already exists with this email address.' })
        );
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
      console.log('cookie dropped with sid: ', sid + ', helpr:' + isHelpr);
      res.send(JSON.stringify({ success: true, message: 'Account created successfully.' }));
      return;
    }
  } catch (err) {
    console.log('/sign-up error:', err);
    res.send(JSON.stringify({ success: false, message: 'Failed to create account, please try again.' }));
    return;
  }
});

// LOGIN END POINT
app.post('/login', upload.none(), async (req, res) => {
  console.log('/login end point entered');
  const sessionId = req.cookies.sid;
  const email = sessions[sessionId];
  console.log('cookie check - sid: ' + sessionId + ', email: ' + email);

  if (email) res.send(JSON.stringify({ openSession: true }));

  try {
  } catch (err) {
    console.log('/login error:', err);
    res.send(JSON.stringify({ success: false, message: 'Failed to login, please try again.' }));
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
