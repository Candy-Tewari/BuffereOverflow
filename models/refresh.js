const mongoose =  require('mongoose');

let schema = new mongoose.Schema({
    token: {
        type: String,
        required: true
    },
    expiresAt: {
        type: Date,
        default: Date.now(),
        index: { expires: 30*24*60*60 }, //30 days 24hours 60 minutes 60 seconds
    }
});

let model =  mongoose.model('refresh_token', schema);

module.exports = model;