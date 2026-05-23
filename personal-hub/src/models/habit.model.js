'use strict';

const { readJson, writeJson } = require('../utils/fileDb');

const FILE = 'habits';

async function findAllByOwner(ownerId) {
  const habits = await readJson(FILE);
  return habits.filter((h) => h.ownerId === ownerId);
}

async function findById(id) {
  const habits = await readJson(FILE);
  return habits.find((h) => h.id === id) ?? null;
}

async function create(habitRecord) {
  const habits = await readJson(FILE);
  habits.push(habitRecord);
  await writeJson(FILE, habits);
  return habitRecord;
}

async function update(id, updates) {
  const habits = await readJson(FILE);
  const index = habits.findIndex((h) => h.id === id);

  if (index === -1) return null;

  habits[index] = {
    ...habits[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  await writeJson(FILE, habits);
  return habits[index];
}

async function increment(id) {
  const habits = await readJson(FILE);
  const index = habits.findIndex((h) => h.id === id);

  if (index === -1) return null;

  habits[index] = {
    ...habits[index],
    checkIns: habits[index].checkIns + 1,
    updatedAt: new Date().toISOString(),
  };

  await writeJson(FILE, habits);
  return habits[index];
}

async function remove(id) {
  const habits = await readJson(FILE);
  const index = habits.findIndex((h) => h.id === id);

  if (index === -1) return false;

  habits.splice(index, 1);
  await writeJson(FILE, habits);
  return true;
}

module.exports = {
  findAllByOwner,
  findById,
  create,
  update,
  increment,
  remove,
};
