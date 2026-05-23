'use strict';

const notesService = require('../services/notes.service');
const asyncHandler = require('../utils/asyncHandler');

const list = asyncHandler(async (req, res) => {
  const notes = await notesService.listNotes(req.user.id, {
    tag: req.query.tag,
  });
  res.status(200).json(notes);
});

const getOne = asyncHandler(async (req, res) => {
  const note = await notesService.getNoteById(req.params.id, req.user.id);
  res.status(200).json(note);
});

const create = asyncHandler(async (req, res) => {
  const note = await notesService.createNote(req.body, req.user.id);
  res.status(201).json(note);
});

const update = asyncHandler(async (req, res) => {
  const note = await notesService.updateNote(
    req.params.id,
    req.body,
    req.user.id,
  );
  res.status(200).json(note);
});

const remove = asyncHandler(async (req, res) => {
  await notesService.deleteNote(req.params.id, req.user.id);
  res.status(200).json({ message: 'Note deleted successfully' });
});

module.exports = { list, getOne, create, update, remove };
