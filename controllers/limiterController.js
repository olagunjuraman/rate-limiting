const sendResponse = require('../utils/sendResponse');
const Subscription = require('./../models/planModel');
const catchAsync = require('./../utils/catchAsync');
const falsyData = require('./../utils/falsyData');

exports.checkLimit = catchAsync(async(req, res, next) => {
    if(req.user.role === 'admin'){
        next()
        return
    }
    const plan = await Subscription.findOne({user: req.user._id});
    if (!plan) {
        return falsyData(next, 'This user has no selected plan');
    }
    if (plan.attemptedRequest > plan.availableRequest) {
        return falsyData(next, 'Access denied. please upgrade subscription to access this endpoint');
    }

    next();
});

exports.increaseAttemptedRequest = catchAsync(async (req, res, next) => {
    if(req.user.role === 'admin'){
        next();
        return
    }
    const plan = await Subscription.findOne({user: req.user._id});
    if (!plan) {
        return falsyData(next, 'This user has no selected plan');
    }
    await plan.updateOne({attemptedRequest: Number(plan.attemptedRequest) + 1})

    next();
});

exports.resetAttemptCount = catchAsync(async (req, res, next) => {
    const plan = await Subscription.findOneAndUpdate({user: req.params.userId}, {attemptedRequest: 0});
    sendResponse(plan, res, 200, {
        message: 'Request count reset successful'
    })
})