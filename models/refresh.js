const mongoose =  require('mongoose');

let schema = new mongoose.Schema({
    token: {
        type: String,
        required: true
    },
    expiresAt: {
        type: Date,
        default: Date.now(),
        index: { expires: '30d' },
    }
});

let model =  mongoose.model('refresh_token', schema);

module.exports = model;