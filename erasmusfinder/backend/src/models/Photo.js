const { Schema, model, ObjectId } = require('mongoose');

const photoSchema = new Schema({
    ubication: {
        name: { type: String},
        lat: { type: Number},
        long: { type: Number}
    },

    likes: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    destination: {
        type: Schema.Types.ObjectId,
        ref: 'Destination'
    },

    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    url: { type:String},
    comment: { type:String},
    anonymous: { type:Boolean}


}, {
    timestamps: true
});

module.exports = model('Photo', photoSchema);
