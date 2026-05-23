'use strict';

const jwt = require('jsonwebtoken');
const AppError = require('./AppError');
const { JWT_SECRET, JWT_EXPIRES_IN } = require('../config/env');

function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, {
    algorithm: 'HS256',
    expiresIn: JWT_EXPIRES_IN,
  });
}

function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET, { algorithms: ['HS256'] });
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      throw new AppError('Token has expired — please log in again', 401);
    }
    throw new AppError('Invalid token', 401);
  }
}

module.exports = { signToken, verifyToken };
