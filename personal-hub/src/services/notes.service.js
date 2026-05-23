'use strict';

const noteModel = require('../models/note.model');
const { generateId } = require('../utils/id');
const AppError = require('../utils/AppError');

async function getOwnedNote(noteId, userId) {
  const note = await noteModel.findById(noteId);
  if (!note || note.ownerId !== userId) {
    throw new AppError('Note not found', 404);
  }
  return note;
}

async function listNotes(userId, { tag } = {}) {
  let notes = await noteModel.findAllByOwner(userId);

  if (tag) {
    const normTag = tag.trim().toLowerCase();
    notes = notes.filter((n) =>
      n.tags.some((t) => t.toLowerCase() === normTag),
    );
  }

  return notes;
}

async function getNoteById(noteId, userId) {
  return getOwnedNote(noteId, userId);
}

async function createNote(data, userId) {
  const now = new Date().toISOString();

  const noteRecord = {
    id: generateId('n'),
    ownerId: userId,
    title: data.title.trim(),
    body: data.body.trim(),
    tags: Array.isArray(data.tags) ? data.tags.map((t) => t.trim()) : [],
    createdAt: now,
    updatedAt: now,
  };

  return noteModel.create(noteRecord);
}

async function updateNote(noteId, data, userId) {
  await getOwnedNote(noteId, userId);

  const updates = {};
  if (data.title !== undefined) updates.title = data.title.trim();
  if (data.body !== undefined) updates.body = data.body.trim();
  if (data.tags !== undefined) updates.tags = data.tags.map((t) => t.trim());

  if (Object.keys(updates).length === 0) {
    throw new AppError('No updatable fields provided', 400);
  }

  return noteModel.update(noteId, updates);
}

async function deleteNote(noteId, userId) {
  await getOwnedNote(noteId, userId);
  await noteModel.remove(noteId);
}

module.exports = { listNotes, getNoteById, createNote, updateNote, deleteNote };
