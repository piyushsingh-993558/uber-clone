
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectToDb = require('./db/db');
const userRoutes=require('./routes/user.routes');
const cookiParser=require('cookie-parser');
const captainRoutes=require('./routes/captain.routes');

// Load environment variables
dotenv.config(); 
 
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser);
// Connect to MongoDB
connectToDb(); 

// Test route
app.get('/', (req, res) => {
  res.send('hello world');
});
app.use('/users',userRoutes);
app.use('/captains',captainRoutes);
 

module.exports = app; 
