'use strict';

const userModel = require('../models/user.model');
const { hashPassword, verifyPassword } = require('../utils/hash');
const { signToken } = require('../utils/token');
const { generateId } = require('../utils/id');
const AppError = require('../utils/AppError');

async function register(username, password) {
  const existing = await userModel.findByUsername(username);
  if (existing) {
    throw new AppError('Username is already taken', 409);
  }

  const userRecord = {
    id: generateId('u'),
    username: username.trim(),
    passwordHash: await hashPassword(password),
    createdAt: new Date().toISOString(),
  };

  const safeUser = await userModel.create(userRecord);

  const token = signToken({ id: safeUser.id, username: safeUser.username });

  return { user: safeUser, token };
}

async function login(username, password) {
  const user = await userModel.findByUsername(username);
  const DUMMY_HASH = '$2b$12herrrrradknsdherrqbqw1rrNSgdse2ju8qw39e0iwdasjs';
  const passwordOk = await verifyPassword(
    password,
    user ? user.passwordHash : DUMMY_HASH,
  );

  if (!user || !passwordOk) {
    throw new AppError('Invalid username or password', 401);
  }

  const token = signToken({ id: user.id, username: user.username });

  return { user: userModel.sanitise(user), token };
}

async function getMe(userId) {
  const user = await userModel.findById(userId);
  if (!user) throw new AppError('User not found', 404);
  return userModel.sanitise(user);
}

module.exports = { register, login, getMe };
