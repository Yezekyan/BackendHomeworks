'use strict';

const { verifyToken } = require('../utils/token');
const AppError = require('../utils/AppError');
const { COOKIE_NAME } = require('../config/env');

function extractBearerToken(authHeader) {
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  const token = authHeader.slice(7).trim();
  return token.length > 0 ? token : null;
}

function authMiddleware(req, res, next) {
  const token =
    extractBearerToken(req.headers.authorization) ||
    req.cookies?.[COOKIE_NAME] ||
    null;

  if (!token) {
    return next(new AppError('No authentication token provided', 401));
  }

  try {
    req.user = verifyToken(token);
    next();
  } catch (err) {
    next(err);
  }
}

module.exports = authMiddleware;
