const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load the config file (env vars)
dotenv.config({ path: './config/config.env' });

// Connect to Database
connectDB();

// Route Files
const auth = require('./routes/auth');
const restaurants = require('./routes/restaurants');
console.log(restaurants);

const app = express();

// Body parser
app.use(express.json());

// Mount The Routes
app.use('/api/v1/auth', auth);
app.use('/api/v1/restaurants', restaurants);

const PORT = process.env.PORT || 5000;

app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`),
);
