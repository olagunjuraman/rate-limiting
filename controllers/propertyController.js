const catchAsync = require('../utils/catchAsync');
const falsyData = require('../utils/falsyData');
const Property = require('../models/propertyModel');
const sendResponse = require('../utils/sendResponse');



// @desc      Get all property
// @route     GET /api/v1/property
// @access    Private
exports.getProperties = catchAsync(async (req, res, next) => {
  const property = await Property.find();
  sendResponse(property, res, 200);
});

// @desc      Get single property
// @route     GET /api/v1/property/:id
// @access    Private
exports.getProperty = catchAsync(async (req, res, next) => {
  const property = await Property.findById(req.params.id);
  if (!property){
    return falsyData(next, `The property with the id ${req.params.id} was not found`)
  }

  sendResponse(property, res, 200);

});

// @desc      Create new property
// @route     POST /api/v1/property
// @access    Private  Admin
exports.createProperty = catchAsync(async (req, res, next) => {
  const property = await Property.create(req.body);
  if (!property){
    return falsyData(next, 'Bad request')
  }

  sendResponse(property, res, 200);
});

// @desc      Update property
// @route     PUT /api/v1/property/:id
// @access    Private Admin
exports.updateProperty = catchAsync(async (req, res, next) => {
  let property = await Property.findById(req.params.id);
  if (!property){
    return falsyData(next, `The property with the id ${req.params.id} was not found`)
  }

  property = await Property.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  sendResponse(property, res, 200);
});


// @desc      Delete property
// @route     DELETE /api/v1/property/:id
// @access    Private Admin
exports.deleteProperty = catchAsync(async (req, res, next) => {
  const property = await Property.findById(req.params.id);

  if (!property){
    return falsyData(next, `The property with the id ${req.params.id} was not found`)
  }

  await property.remove();

  sendResponse(property, res, 200);
});

