'use strict';

const booksService = require('../services/books.service');
const asyncHandler = require('../utils/asyncHandler');

const list = asyncHandler(async (req, res) => {
  const books = await booksService.listBooks(req.user.id, {
    status: req.query.status,
  });
  res.status(200).json(books);
});

const getOne = asyncHandler(async (req, res) => {
  const book = await booksService.getBookById(req.params.id, req.user.id);
  res.status(200).json(book);
});

const create = asyncHandler(async (req, res) => {
  const book = await booksService.createBook(req.body, req.user.id);
  res.status(201).json(book);
});

const update = asyncHandler(async (req, res) => {
  const book = await booksService.updateBook(
    req.params.id,
    req.body,
    req.user.id,
  );
  res.status(200).json(book);
});

const remove = asyncHandler(async (req, res) => {
  await booksService.deleteBook(req.params.id, req.user.id);
  res.status(200).json({ message: 'Book deleted successfully' });
});

module.exports = { list, getOne, create, update, remove };
