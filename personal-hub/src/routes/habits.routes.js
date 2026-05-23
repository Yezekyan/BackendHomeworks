'use strict';

const { Router } = require('express');
const habitsCtrl = require('../controllers/habits.controller');
const authMW = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');

const router = Router();

router.use(authMW);

router.get('/', habitsCtrl.list);
router.get('/:id', habitsCtrl.getOne);
router.post('/', validate('createHabit'), habitsCtrl.create);
router.patch('/:id', validate('updateHabit'), habitsCtrl.update);
router.post('/:id/check-in', habitsCtrl.checkIn);
router.delete('/:id', habitsCtrl.remove);

module.exports = router;
