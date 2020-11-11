const mongoose =  require('mongoose');

const schema = new mongoose.Schema({
    code: {
        type: 'string',
        required: true,
    },
    expiresAt: {
        type: Date,
        default: Date.now(),
        index: { expires: '10m' }
    }
});

const model = mongoose.model('parcel', schema);

module.exports = model;