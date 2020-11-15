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

schema.index({"createdAt": 1}, {expireAfterSeconds: 60}); //4 mins * 60 seconds

let model =  mongoose.model('refresh_token', schema);

module.exports = model;