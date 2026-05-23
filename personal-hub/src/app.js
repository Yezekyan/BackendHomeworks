'use strict';

const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const routes = require('./routes/index');
const loggerMW = require('./middlewares/logger.middleware');
const notFoundMW = require('./middlewares/notFound.middleware');
const errorMW = require('./middlewares/error.middleware');

const app = express();

app.disable('x-powered-by');

app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'no-referrer');
  next();
});

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  }),
);

app.use(loggerMW);

app.use(
  express.json({
    limit: '100kb',
  }),
);

app.use(cookieParser());

app.use('/api', routes);

app.use(notFoundMW);

app.use(errorMW);

module.exports = app;
