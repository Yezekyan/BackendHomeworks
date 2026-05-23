'use strict';

const AppError = require('../utils/AppError');

function errorMiddleware(err, req, res, _next) {
  if (res.headersSent) {
    return;
  }

  const isOperational = err instanceof AppError && err.isOperational;

  const status = isOperational ? err.statusCode : 500;
  const message = isOperational ? err.message : 'Internal Server Error';

  if (!isOperational) {
    console.error('[error]', {
      message: err.message,
      stack: err.stack,
      path: req.path,
      method: req.method,
    });
  }

  res.status(status).json({
    error: { message, status },
  });
}

module.exports = errorMiddleware;
