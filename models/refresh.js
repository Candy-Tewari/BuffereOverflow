const mongoose =  require('mongoose');

let schema = new mongoose.Schema({
    token: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: new Date()
    }
});

schema.index({"createdAt": 1}, {expireAfterSeconds: 2592000}); //30days * 24hours * 60 minutes * 60 seconds

let model =  mongoose.model('token', schema);

module.exports = model;