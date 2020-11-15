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
    createdAt: {
        type: Date,
        default: new Date()
    }
});

schema.index({"createdAt": 1}, {expireAfterSeconds: 600}); //10 minutes * 60 seconds

const model = mongoose.model('forgot-password-valid-links', schema);

module.exports = model;