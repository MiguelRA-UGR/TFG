const { Schema, model, ObjectId } = require('mongoose');

const photoSchema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    type: { type:Number, default:0},
    comment: { type:String, required:true},

    destination: {type: Schema.Types.ObjectId, ref: 'Destination', required: false},
    reported: {type: Schema.Types.ObjectId, ref: 'User', required: false}
}, {
    timestamps: true
});

module.exports = model('Request', photoSchema);
