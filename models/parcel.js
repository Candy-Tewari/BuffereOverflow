const mongoose =  require('mongoose');

const schema = new mongoose.Schema({
    code: {
        type: 'string',
        required: true,
    },
    createdAt: {
        type: Date,
        default: new Date()
    }
});

schema.index({"createdAt": 1}, {expireAfterSeconds: 600}); //10 minutes * 60 seconds

const model = mongoose.model('parcel', schema);

module.exports = model;