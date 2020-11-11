const mongoose = require('mongoose');

let schema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true 
    },
    college: {
        type: String,
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    roll_no: {
        type: Number,
        required: true
    },
    verified: {
        type: Boolean,
        required: true,
        default: false
    },
    rating: {
        type: Number,
        required: true,
        default: 0
    }
});

let model = mongoose.model('user', schema);
module.exports = model;