const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const config = require('./config');

// routes
const authRoutes = require('./routes/api/auth');
const listRoutes = require('./routes/api/lists');
const userRoutes = require('./routes/api/user');
const homeRoutes = require('./routes/api/home');
const auth = require('./middleware/auth');

const { MONGO_URI, MONGO_DB_NAME } = config;

const app = express();

// CORS Middleware
app.use(cors());
// Logger Middleware
app.use(morgan('dev'));
// Bodyparser Middleware
app.use(bodyParser.json());

// DB Config
const db = `${MONGO_URI}`;

// Connect to Mongo
mongoose
  .connect(db, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    dbName: MONGO_DB_NAME,
  }) // Adding new mongo url parser
  .then(() => console.log('MongoDB Connected...'))
  .catch((err) => console.log(err));

// Use Routes
app.use('/api/lists', listRoutes);
app.use('/api/user', auth, userRoutes);
app.use('/auth', authRoutes);
app.use('/', homeRoutes);

// Serve static assets if in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

module.exports = app;
