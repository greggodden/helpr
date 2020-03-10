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
    db = client.db('alibay');
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
  console.log('body:', body);
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
