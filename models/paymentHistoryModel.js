const mongoose = require('mongoose');

const paymentHistorySchema = new mongoose.Schema({
    plan: {
        type: mongoose.Schema.ObjectId,
        ref: 'Subscription',
        required: [true, 'payment history must have plan'],
    },
    amount: {
        type: Number,
        required: [true, 'payment history must contain amount']
    }
},
{
    timestamps: true,
    toJSON: {
        virtuals: true,
    },
    toObject: {
        virtuals: true,
    },
});
// Query Middleware
paymentHistorySchema.pre(/^find/, function (next) {
    this.populate({
      path: 'plan',
    });
    next();
  });

const PaymentHistory = mongoose.model('PaymentHistory', paymentHistorySchema, 'paymentHistory');

module.exports = PaymentHistory;