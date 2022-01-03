const express = require('express');
const authController = require('../controllers/authController');
const limiterController = require('./../controllers/limiterController');
const planController = require('./../controllers/planController');

const router = express.Router();

router.use(authController.protect)

router.route('/reset-count/:userId').post(authController.restrictTo('admin'), limiterController.resetAttemptCount);

router.route('/').get(planController.getUserPlan).post(planController.upgradeSubscription)

router.route('/history').get(planController.getUserPaymentHistory)

module.exports = router;