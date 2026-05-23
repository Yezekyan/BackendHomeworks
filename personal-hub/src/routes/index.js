'use strict';

const { Router } = require('express');
const authRoutes = require('./auth.routes');
const notesRoutes = require('./notes.routes');
const booksRoutes = require('./books.routes');
const habitsRoutes = require('./habits.routes');

const router = Router();

router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

router.use('/auth', authRoutes);
router.use('/notes', notesRoutes);
router.use('/books', booksRoutes);
router.use('/habits', habitsRoutes);

module.exports = router;
