const { Schema, model, ObjectId } = require('mongoose');

const reviewSchema = new Schema({
    comment: { type: String, required: true },

    score: { type: Number, default: -1 },
    
    destination: {
        type: Schema.Types.ObjectId,
        ref: 'Destination',
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

module.exports = model('Review', reviewSchema);
