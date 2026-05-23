'use strict';

const habitModel = require('../models/habit.model');
const { generateId } = require('../utils/id');
const AppError = require('../utils/AppError');

async function getOwnedHabit(habitId, userId) {
  const habit = await habitModel.findById(habitId);
  if (!habit || habit.ownerId !== userId) {
    throw new AppError('Habit not found', 404);
  }
  return habit;
}

async function listHabits(userId) {
  return habitModel.findAllByOwner(userId);
}

async function getHabitById(habitId, userId) {
  return getOwnedHabit(habitId, userId);
}

async function createHabit(data, userId) {
  const now = new Date().toISOString();

  const habitRecord = {
    id: generateId('h'),
    ownerId: userId,
    name: data.name.trim(),
    frequency: data.frequency,
    checkIns: 0,
    createdAt: now,
    updatedAt: now,
  };

  return habitModel.create(habitRecord);
}

async function updateHabit(habitId, data, userId) {
  await getOwnedHabit(habitId, userId);

  const updates = {};
  if (data.name !== undefined) updates.name = data.name.trim();
  if (data.frequency !== undefined) updates.frequency = data.frequency;

  if (Object.keys(updates).length === 0) {
    throw new AppError('No updatable fields provided', 400);
  }

  return habitModel.update(habitId, updates);
}

async function checkIn(habitId, userId) {
  await getOwnedHabit(habitId, userId);
  return habitModel.increment(habitId);
}

async function deleteHabit(habitId, userId) {
  await getOwnedHabit(habitId, userId);
  await habitModel.remove(habitId);
}

module.exports = {
  listHabits,
  getHabitById,
  createHabit,
  updateHabit,
  checkIn,
  deleteHabit,
};
