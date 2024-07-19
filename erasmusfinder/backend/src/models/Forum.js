const { Schema, model, ObjectId } = require('mongoose');

const forumSchema = new Schema({

    users: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],

    threads: [{
        type: Schema.Types.ObjectId,
        ref: 'Thread'
    }],

    destination: {
        type: Schema.Types.ObjectId,
        ref: 'Destination'
    },

    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },

    url: { type:String},
    description: { type:String},
    title: { type:String}
}, {
    timestamps: true
});

module.exports = model('Forum', forumSchema);
