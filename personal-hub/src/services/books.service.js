'use strict';

const bookModel = require('../models/book.model');
const { generateId } = require('../utils/id');
const AppError = require('../utils/AppError');

const DEFAULT_STATUS = 'to-read';

async function getOwnedBook(bookId, userId) {
  const book = await bookModel.findById(bookId);
  if (!book || book.ownerId !== userId) {
    throw new AppError('Book not found', 404);
  }
  return book;
}

async function listBooks(userId, { status } = {}) {
  let books = await bookModel.findAllByOwner(userId);

  if (status) {
    books = books.filter((b) => b.status === status);
  }

  return books;
}

async function getBookById(bookId, userId) {
  return getOwnedBook(bookId, userId);
}

async function createBook(data, userId) {
  const status = data.status ?? DEFAULT_STATUS;

  if (data.rating != null && status !== 'finished') {
    throw new AppError('rating can only be set when status is "finished"', 400);
  }

  const now = new Date().toISOString();

  const bookRecord = {
    id: generateId('b'),
    ownerId: userId,
    title: data.title.trim(),
    author: data.author.trim(),
    status,
    rating: data.rating ?? null,
    createdAt: now,
    updatedAt: now,
  };

  return bookModel.create(bookRecord);
}

async function updateBook(bookId, data, userId) {
  const existing = await getOwnedBook(bookId, userId);

  const updates = {};
  if (data.title !== undefined) updates.title = data.title.trim();
  if (data.author !== undefined) updates.author = data.author.trim();
  if (data.status !== undefined) updates.status = data.status;
  if (data.rating !== undefined) updates.rating = data.rating;

  if (Object.keys(updates).length === 0) {
    throw new AppError('No updatable fields provided', 400);
  }
  const effectiveStatus = updates.status ?? existing.status;
  const effectiveRating =
    updates.rating !== undefined ? updates.rating : existing.rating;

  if (effectiveRating != null && effectiveStatus !== 'finished') {
    throw new AppError('rating can only be set when status is "finished"', 400);
  }

  if (updates.status && updates.status !== 'finished') {
    updates.rating = null;
  }

  return bookModel.update(bookId, updates);
}

async function deleteBook(bookId, userId) {
  await getOwnedBook(bookId, userId);
  await bookModel.remove(bookId);
}

module.exports = { listBooks, getBookById, createBook, updateBook, deleteBook };
