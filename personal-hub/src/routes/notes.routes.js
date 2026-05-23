'use strict';

const { Router } = require('express');
const notesCtrl = require('../controllers/notes.controller');
const authMW = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');

const router = Router();

router.use(authMW);

router.get('/', notesCtrl.list);
router.get('/:id', notesCtrl.getOne);
router.post('/', validate('createNote'), notesCtrl.create);
router.patch('/:id', validate('updateNote'), notesCtrl.update);
router.delete('/:id', notesCtrl.remove);

module.exports = router;
