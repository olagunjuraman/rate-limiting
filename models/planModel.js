const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
    plan: {
        type: String,
        enum: ['free', 'premium', 'gold'],
        default: 'free'
    },
    amount: Number,
    availableRequest: Number,
    attemptedRequest: {
        type: Number,
        default: 0
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Subscription must belong to a user'],
    },

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

subscriptionSchema.pre('save', function (next) {
    switch (this.plan) {
        case 'free':
          this.availableRequest = 100;
          break;
        case 'premium':
          this.availableRequest = 500;
        case 'gold':
          this.availableRequest = 1000;
          break;
        default:
          this.availableRequest = 100;
    }
    next();
});

// Query Middleware
subscriptionSchema.pre(/^find/, function (next) {
    this.populate({
      path: 'user',
    });
    next();
  });

const Subscription = mongoose.model('Subscription', subscriptionSchema, 'subscriptions');

module.exports = Subscription;