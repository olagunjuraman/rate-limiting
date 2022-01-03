const mongoose = require('mongoose');


const propertySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please add a name"],
        unique: true,
        trim: true,
        maxlength: [50, "Name cannot be longer than 50"],
    },
    location: {
        type: String,
        required: true,
        unique: true,
    },
    numberOfApartment: {
        type: Number,
        required: true,
    },
    numberOfFloors: {
        type: Number,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    createdAt:{
        type: Date,
        default: Date.now
    }
});


const Property = mongoose.model('Property', propertySchema);

module.exports = Property;