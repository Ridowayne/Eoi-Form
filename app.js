const express = require('express');
const bodyParser = require('body-parser');

const formContoller = require('./controllers/formController');
const authContoller = require('./controllers/authController');
const app = express();

app.use(express.json());
app.use(express.static(`${__dirname}/public`));
app.use(bodyParser.urlencoded({ extended: true }));

// routes
app.post('/signup', authContoller.signup);
app.post('/login', authContoller.login);
app
  .post('/forms', formContoller.expression)
  .get('/forms', authContoller.protect, formContoller.readExpression);

app.get('/formsbyskills', authContoller.protect, formContoller.formBySkill);
app.get('/handledform', authContoller.protect, formContoller.formHandled);

// Unhandlled routes
app.all('*', (req, res) => {
  res.status(404).json({
    status: 'fail',
    message: `Can't find ${req.originalUrl} on this server!`,
  });
});

module.exports = app;
