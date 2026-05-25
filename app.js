const fs = require('fs');
const express = require('express');
const app = express();  // Create an express application
const morgan = require('morgan');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

// 1) Middleware functions

app.use(morgan('dev'));
app.use(express.json()); // Middleware to parse JSON bodies
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  console.log('Hello from the middleware 👋');
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

//// Below code is for IST time zone
// app.use((req, res, next) => {
//   req.requestTime = new Date().toLocaleString('en-IN', {
//     timeZone: 'Asia/Kolkata',
//   });
//   next();
// });

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;
