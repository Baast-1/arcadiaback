const mongoose = require('mongoose');

const avisSchema = new mongoose.Schema({
    pseudo: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    isVisible: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Avis', avisSchema);