'use strict';

const { Router } = require('express');
const authCtrl = require('../controllers/auth.controller');
const authMW = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');

const router = Router();

router.post('/register', validate('register'), authCtrl.register);
router.post('/login', validate('login'), authCtrl.login);

router.post('/logout', authMW, authCtrl.logout);
router.get('/me', authMW, authCtrl.getMe);

module.exports = router;
