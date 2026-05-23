'use strict';

const { readJson, writeJson } = require('../utils/fileDb');

const FILE = 'books';

async function findAllByOwner(ownerId) {
  const books = await readJson(FILE);
  return books.filter((b) => b.ownerId === ownerId);
}

async function findById(id) {
  const books = await readJson(FILE);
  return books.find((b) => b.id === id) ?? null;
}

async function create(bookRecord) {
  const books = await readJson(FILE);
  books.push(bookRecord);
  await writeJson(FILE, books);
  return bookRecord;
}

async function update(id, updates) {
  const books = await readJson(FILE);
  const index = books.findIndex((b) => b.id === id);

  if (index === -1) return null;

  books[index] = {
    ...books[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  await writeJson(FILE, books);
  return books[index];
}

async function remove(id) {
  const books = await readJson(FILE);
  const index = books.findIndex((b) => b.id === id);

  if (index === -1) return false;

  books.splice(index, 1);
  await writeJson(FILE, books);
  return true;
}

module.exports = { findAllByOwner, findById, create, update, remove };
