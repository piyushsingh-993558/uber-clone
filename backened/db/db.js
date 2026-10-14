
const mongoose = require('mongoose');

function connectToDb() {
  mongoose
    .connect(process.env.DB_CONNECT)
    .then(() => {
      console.log('Connected to DB');
    }) 
    .catch((err) => {
      console.log('Database connection error:', err.message);
    });
}

module.exports = connectToDb;
