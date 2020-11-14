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
    createAt: {
        type: Date,
        default: Date.now(),
        index: { expires: '10m' } 
    }
});

let model =  mongoose.model('refresh_token', schema);

module.exports = model;