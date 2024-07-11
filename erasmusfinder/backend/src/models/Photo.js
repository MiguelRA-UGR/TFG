const { Schema, model, ObjectId } = require('mongoose');

const photoSchema = new Schema({
    ubication: {
        name: { type: String, required: true},
        lat: { type: Number, required:true},
        long: { type: Number, required:true}
    },

    likes: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }],
    destination: {
        type: Schema.Types.ObjectId,
        ref: 'Destination',
        required: true
    },

    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    url: { type:String, required: true},
    comment: { type:String, required: true},
    anonymous: { type:Boolean, required: true}


}, {
    timestamps: true
});

module.exports = model('Photo', photoSchema);
