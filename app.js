const express = require('express');
const contoller = require('./controller');

const app = express();

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

// routes
app.post('/signup', contoller.signup);
app.post('/login', contoller.login);
app.post('/form', contoller.expression);
app.get('/forms', contoller.protect, contoller.readExpression);

// Unhandlled routes
app.all('*', (req, res) => {
  res.status(404).json({
    status: 'fail',
    message: `Can't find ${req.originalUrl} on this server!`,
  });
});

module.exports = app;
