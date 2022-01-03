const express = require('express');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

const router = express.Router();

router
  .route('/')
  .get(
    authController.protect,
    authController.restrictTo('admin'),
    userController.getAllUsers
  );

router.route('/signup').post(authController.signUp);
router.route('/login').post(authController.login);

router.use(authController.protect);


router
  .route('/updateMe')
  .patch(
    userController.updateProfile
  );

router.route('/me').get(userController.getCurrentUser);

router.delete('/deleteMe', userController.deleteMe);

router.use(authController.restrictTo('admin'));

router
  .route('/:id')
  .delete(userController.deleteUser)
  .get(userController.getUser)
  .patch(userController.updateUser);

module.exports = router;
