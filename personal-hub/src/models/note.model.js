'use strict';

const { readJson, writeJson } = require('../utils/fileDb');

const FILE = 'notes';

async function findAllByOwner(ownerId) {
  const notes = await readJson(FILE);
  return notes.filter((n) => n.ownerId === ownerId);
}

async function findById(id) {
  const notes = await readJson(FILE);
  return notes.find((n) => n.id === id) ?? null;
}

async function create(noteRecord) {
  const notes = await readJson(FILE);
  notes.push(noteRecord);
  await writeJson(FILE, notes);
  return noteRecord;
}

async function update(id, updates) {
  const notes = await readJson(FILE);
  const index = notes.findIndex((n) => n.id === id);

  if (index === -1) return null;
  notes[index] = {
    ...notes[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  await writeJson(FILE, notes);
  return notes[index];
}

async function remove(id) {
  const notes = await readJson(FILE);
  const index = notes.findIndex((n) => n.id === id);

  if (index === -1) return false;

  notes.splice(index, 1);
  await writeJson(FILE, notes);
  return true;
}

module.exports = { findAllByOwner, findById, create, update, remove };
