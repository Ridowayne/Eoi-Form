const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'kindly fill in your name'],
  },
  email: {
    type: String,
    required: [true, 'kindly fill in your email address'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'kindly provide a valid email address'],
  },
  role: {
    type: String,
    enum: ['admin'],
  },
  password: {
    type: String,
    minlength: 8,
    required: [true, 'Please provide a Password'],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your Password'],
    validate: {
      // this only works for CREATE AND SAVE!!
      validator: function (el) {
        return el === this.password;
      },
      message: 'password-Confirm  does not match password',
    },
  },
});

userSchema.pre('save', async function (next) {
  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // deleltes the password confirmed
  this.passwordConfirm = undefined;
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
