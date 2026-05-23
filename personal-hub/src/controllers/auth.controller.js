'use strict';

const authService = require('../services/auth.service');
const asyncHandler = require('../utils/asyncHandler');
const {
  COOKIE_NAME,
  COOKIE_MAX_AGE_MS,
  IS_PRODUCTION,
} = require('../config/env');

const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: 'lax',
  secure: IS_PRODUCTION,
  maxAge: COOKIE_MAX_AGE_MS,
};

const register = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  const { user, token } = await authService.register(username, password);

  res.cookie(COOKIE_NAME, token, COOKIE_OPTIONS);

  res.status(201).json({ user, token });
});

const login = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  const { user, token } = await authService.login(username, password);

  res.cookie(COOKIE_NAME, token, COOKIE_OPTIONS);

  res.status(200).json({ user, token });
});

const logout = asyncHandler(async (req, res) => {
  res.clearCookie(COOKIE_NAME, {
    httpOnly: COOKIE_OPTIONS.httpOnly,
    sameSite: COOKIE_OPTIONS.sameSite,
    secure: COOKIE_OPTIONS.secure,
  });

  res.status(200).json({ message: 'Logged out successfully' });
});

const getMe = asyncHandler(async (req, res) => {
  const user = await authService.getMe(req.user.id);
  res.status(200).json(user);
});

module.exports = { register, login, logout, getMe };
