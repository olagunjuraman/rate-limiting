const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const falsyData = require('./../utils/falsyData');
const sendResponse = require('./../utils/sendResponse');

const filterObject = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((key) => {
    if (allowedFields.includes(key)) {
      newObj[key] = obj[key];
    }
  });

  return newObj;
};

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();
  sendResponse(users, res, 200, { result: true });
});

exports.getCurrentUser = catchAsync(async (req, res, next) => {
  sendResponse(req.user, res, 200);
});

exports.updateUser = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const updatedUser = await User.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!updatedUser) {
    return falsyData(next, `Can't find user with id: ${id}`, 400);
  }
  sendResponse(updatedUser, res);
});
exports.getUser = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findById(id);
  if (!user) {
    return falsyData(next, `Can't find user with id: ${id}`, 404);
  }
  sendResponse(user, res, 200);
});
exports.deleteUser = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findByIdAndDelete(id);
  if (!user) {
    return falsyData(next, `Can't find user with id: ${id}`, 400);
  }
  res.status(204).json({
    status: 'success',
    message: 'User successfully deleted',
  });
});


exports.updateProfile = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.confirmPassword || req.body.email) {
    return falsyData(
      next,
      'This route is not for password or email update. Please use "/updateMyPassword" for password update or "/sendResetEmailToken" for email reset instead',
      401
    );
  }
  const filteredUserData = filterObject(
    req.body,
    'profileImage',
    'name',
    'username',
    'dateOfBirth',
    'phone'
  );
  if (req.body.profileImage) {
    filteredUserData.profileImage = req.body.profileImage;
  }
  const newUser = await User.findByIdAndUpdate(req.user._id, filteredUserData, {
    new: true,
    runValidators: true,
  });
  sendResponse(newUser, res, 200, { message: 'Profile Updated Successfully' });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { active: false },
    { new: true, runValidators: true }
  );

  if (!user) {
    return falsyData(next, `Can't find user with id: ${req.user._id}`, 404);
  }
  sendResponse(user, res, 204, {
    message: 'Your Account Has Been Successfully Deleted',
  });
});
