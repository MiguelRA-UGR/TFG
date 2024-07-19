const { Schema, model, ObjectId } = require('mongoose');

const threadSchema = new Schema({

    replies: [{
        type: Schema.Types.ObjectId,
        ref: 'Reply'
    }],

    votes: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],

    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },

    forum: {
        type: Schema.Types.ObjectId,
        ref: 'Forum'
    },

    url: { type:String},
    title: { type:String},
    content: { type:String}
}, {
    timestamps: true
});

module.exports = model('Thread', threadSchema);