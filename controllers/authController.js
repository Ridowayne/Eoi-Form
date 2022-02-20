const jwt = require('jsonwebtoken');
const catchAsync = require('../utils/catchAsync');

const User = require('../model/userModel');
const AppError = require('../utils/appError');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie('jwt', token, cookieOptions);

  // remove the password from the output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

//  controller for signup
exports.signup = catchAsync(async (req, res, next) => {
  try {
    const newUser = await User.create(req.body);
    createSendToken(newUser, 201, res);
    res.status(201).json({
      status: 'success',
      data: {
        newUser,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(401).json({
      status: 'fail',
      message: error,
    });
  }
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  //1) check if email and password exist
  if (!email || !password) {
    return next(
      new AppError('Please provide a valide email and password', 400)
    );
  }

  //2) check if user exists && password is correct
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('incorrect email or password', 401));
  }

  //3) if everything is ok, send token to client
  createSendToken(user, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  // get token and check if token exist
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  //2) verification
  if (!token) {
    return next();
    new AppError('You are not logged in!kindly log in to gain access', 401);
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // check if user stiil exist
  const freshUser = await User.findById(decoded.id);
  if (!freshUser) {
    return next();
    new AppError('The token belonging to this user does no longer exist', 401);
  }

  // check if user changed password after the token was issued
  if (freshUser.changedPasswordAfter(decoded.iat)) {
    return next();
    new AppError('User recently Changed password! please log in again', 401);
  }
  // Grant Access to protected route
  req.user = freshUser;
  next();
});
