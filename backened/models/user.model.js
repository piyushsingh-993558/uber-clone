
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
      minlength: [3, 'First name must be at least 3 characters long'],
      trim: true
    },

    lastname: {
      type: String,
      minlength: [3, 'Last name must be at least 3 characters long'],
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      minlength: [5, 'Email must be at least 5 characters long'],
      lowercase: true,
      trim: true
    },

    password: {
      type: String,
      required: true,
      select: false
    },

    socketId: {
      type: String,
      default: null
    }
  },
  {
    timestamps: true
  }
);

// Generate JWT token
userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { _id: this._id },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );

  return token;
};

// Compare entered password with hashed password
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};
 
// Hash password before saving it
userSchema.statics.hashPassword = async function (password) {
  return await bcrypt.hash(password, 10);
};
const userModel=mongoose.model('user',userSchema);





module.exports=userModel;