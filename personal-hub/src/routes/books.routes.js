'use strict';

const { Router } = require('express');
const booksCtrl = require('../controllers/books.controller');
const authMW = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');

const router = Router();

router.use(authMW);

router.get('/', booksCtrl.list);
router.get('/:id', booksCtrl.getOne);
router.post('/', validate('createBook'), booksCtrl.create);
router.patch('/:id', validate('updateBook'), booksCtrl.update);
router.delete('/:id', booksCtrl.remove);

module.exports = router;
