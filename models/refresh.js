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
});

schema.index({expireAt: 1}, {expiresAfterSeconds: 240}); //4 mins * 60 seconds

let model =  mongoose.model('refresh_token', schema);

module.exports = model;