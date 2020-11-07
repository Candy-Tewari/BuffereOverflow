const mongoose =  require('mongoose');

const schema = new mongoose.Schema({
    email: {
        type: String, 
        required: true,
    },
    link: {
        type: String, 
        required: true,
    },
    expiresAt: {
        type: Date,
        default: Date.now(),
        index: { expires: '10m'}
    }
});

const model = mongoose.model('forgot-password-valid-links', schema);

module.exports = model;