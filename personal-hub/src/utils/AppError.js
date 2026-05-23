'use strict';

class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);

    Object.setPrototypeOf(this, new.target.prototype);

    this.name = 'AppError';
    this.statusCode = statusCode;
    this.isOperational = true;
  }
}

module.exports = AppError;
