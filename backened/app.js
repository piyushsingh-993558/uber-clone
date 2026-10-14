
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectToDb = require('./db/db');
const userRoutes=require('./routes/user.routes');

// Load environment variables
dotenv.config(); 

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
connectToDb();

// Test route
app.get('/', (req, res) => {
  res.send('hello world');
});
app.use('/users',userRoutes);

module.exports = app; 
