'use strict';

const habitsService = require('../services/habits.service');
const asyncHandler = require('../utils/asyncHandler');

const list = asyncHandler(async (req, res) => {
  const habits = await habitsService.listHabits(req.user.id);
  res.status(200).json(habits);
});

const getOne = asyncHandler(async (req, res) => {
  const habit = await habitsService.getHabitById(req.params.id, req.user.id);
  res.status(200).json(habit);
});

const create = asyncHandler(async (req, res) => {
  const habit = await habitsService.createHabit(req.body, req.user.id);
  res.status(201).json(habit);
});

const update = asyncHandler(async (req, res) => {
  const habit = await habitsService.updateHabit(
    req.params.id,
    req.body,
    req.user.id,
  );
  res.status(200).json(habit);
});

const checkIn = asyncHandler(async (req, res) => {
  const habit = await habitsService.checkIn(req.params.id, req.user.id);
  res.status(200).json(habit);
});

const remove = asyncHandler(async (req, res) => {
  await habitsService.deleteHabit(req.params.id, req.user.id);
  res.status(200).json({ message: 'Habit deleted successfully' });
});

module.exports = { list, getOne, create, update, checkIn, remove };
