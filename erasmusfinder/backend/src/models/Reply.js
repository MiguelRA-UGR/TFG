const { Schema, model, ObjectId } = require('mongoose');

const replySchema = new Schema({

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

    url: { type:String},
    title: { type:String},
    content: { type:String}
}, {
    timestamps: true
});

module.exports = model('Reply', replySchema);