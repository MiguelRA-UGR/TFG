const { Schema, model } = require('mongoose');

const notificationSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    text: {
        type: String,
        required: true
    },
    type: {
        type: Number,
        required: true
    },
    forum: {
        type: Schema.Types.ObjectId,
        ref: 'Forum'
    }
}, {
    timestamps: true
});

module.exports = model('Notification', notificationSchema);
