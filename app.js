const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const formContoller = require('./controllers/formController');
const authContoller = require('./controllers/authController');
const generalErrorHandler = require('./controllers/errorController');
const app = express();

// middlewares
app.use(express.json());
app.use(express.static(`${__dirname}/public`));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet);
app.use(mongoSanitize());
app.use(xss());
app.use(
  hpp({
    whitelist: ['gender', 'skills'],
  })
);

// routes
app.post('/signup', authContoller.signup);
app.post('/login', authContoller.login);
app
  .post('/forms', formContoller.expression)
  .get(
    '/forms',
    authContoller.protect,
    // authContoller.restrictTo('admin'),
    formContoller.getAllforms
  )
  .patch(authContoller.protect, formContoller.comment);

app.get('/formsbyskills', authContoller.protect, formContoller.formBySkill);
app.get('/handledform', authContoller.protect, formContoller.formHandled);
app.get('/form', authContoller.protect, formContoller.getForm);
// Unhandlled routes
app.all('*', (req, res) => {
  res.status(404).json({
    status: 'fail',
    message: `Can't find ${req.originalUrl} on this server!`,
  });
});

app.use(generalErrorHandler);

module.exports = app;
