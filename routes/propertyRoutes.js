const express = require('express');
const { celebrate, Joi }  = require("celebrate");
const propertyController = require('../controllers/propertyController');
const authController = require('../controllers/authController');
const limiterController = require('../controllers/limiterController');


const router = express.Router();

router.use(authController.protect)


router
  .route("/")
  .get(limiterController.increaseAttemptedRequest,
    limiterController.checkLimit,
    propertyController.getProperties)
  .post(
    authController.restrictTo('admin'),
    celebrate({
      body: Joi.object({
        name: Joi.string().required(),
        location: Joi.string().required(),
        description: Joi.string().required(),
        numberOfApartment:Joi.number().required(),
        numberOfFloors:Joi.number().required(),
        price: Joi.number().required()
      }),
    }),
    propertyController.createProperty
  );

router
  .route("/:id")
  .delete(authController.restrictTo('admin'), propertyController.deleteProperty)
  .put(
    authController.restrictTo('admin'),
    celebrate({
      body: Joi.object({
        name: Joi.string().optional(),
        description: Joi.string().optional(),
        price: Joi.string().optional(),
        quantity: Joi.number().optional(),
      }),
    }),
    propertyController.updateProperty
  );


  module.exports = router;
