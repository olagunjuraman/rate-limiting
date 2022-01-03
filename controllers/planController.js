const Subscription = require('../models/planModel');
const PaymentHistory = require('../models/paymentHistoryModel');
const catchAsync = require('../utils/catchAsync');
const falsyData = require('../utils/falsyData');
const sendResponse = require('../utils/sendResponse');


exports.upgradeSubscription = catchAsync(async (req, res, next) => {
    const {amount, plan} = req.body
  const subscription = await Subscription.findOne({user: req.user.id});
    if (!subscription) {
        return falsyData(next, 'the user has no active subscription')
    }

    const subscripitionId = subscription.id;


    subscription.plan = plan;
    subscription.amount = amount
    subscription.attemptedRequest = 0;


    // using the save method instead of the update method because of the
    // pre-save middleware in the subscripition model
    await subscription.save();



    const paymentHistory = await PaymentHistory.create({
        plan: subscripitionId,
        amount: req.body.amount
    });

    sendResponse(paymentHistory, res, 200)
});

exports.getUserPaymentHistory = catchAsync(async (req, res, next) => {
    const user = req.user.id;
    const subscription = await Subscription.findOne({user});
    if (!subscription) {
        return falsyData(next, 'the user has no active subscription')
    }
    const paymentHistory = await PaymentHistory.find({plan: subscription.id});

    sendResponse(paymentHistory, res, 200, {
        result: true
    });
});

exports.getUserPlan = catchAsync(async (req, res, next) => {
    const user = req.user.id;
    const subscription = await Subscription.findOne({user});
    if (!subscription) {
        return falsyData(next, 'the user has no active subscription')
    }
    sendResponse(subscription, res, 200);
});


