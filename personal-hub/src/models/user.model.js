'use strict';

const { readJson, writeJson } = require('../utils/fileDb');

const FILE = 'users';

function sanitise(user) {
  if (!user) return null;
  const { passwordHash, ...safe } = user;
  return safe;
}

async function findAll() {
  return readJson(FILE);
}

async function findById(id) {
  const users = await readJson(FILE);
  return users.find((u) => u.id === id) ?? null;
}

async function findByUsername(username) {
  const users = await readJson(FILE);
  return (
    users.find((u) => u.username.toLowerCase() === username.toLowerCase()) ??
    null
  );
}

async function create(userRecord) {
  const users = await readJson(FILE);
  users.push(userRecord);
  await writeJson(FILE, users);
  return sanitise(userRecord);
}

module.exports = { findAll, findById, findByUsername, create, sanitise };
