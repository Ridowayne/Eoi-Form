const mongoose = require('mongoose');
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
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

userSchema.pre('save', async function (next) {
  // only runs if password is modified
  if (!this.isModified('password')) return next();

  // deleltes the password confirmed
  this.passwordConfirm = undefined;
});

const User = mongoose.model('User', userSchema);

module.exports = User;
