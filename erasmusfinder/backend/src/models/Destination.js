const { Schema, model, ObjectId } = require('mongoose');

const destinationSchema = new Schema({
    name: { type: String, required: true},
    iso: {type: String},
    description: { type: String, required:false},
    country: { type: String, required:true},
    coords: {
        lat: { type: Number, required:true},
        long: { type: Number, required:true}
    },
    population: { type: String },
    cost_life: { type: String },
    surface: { type: String },
    clima: {
        general: { type: String },
        winter: { type: String },
        summer: { type: String }
    },
    languages: [{ type: String }],
    n_users: { type: Number, default: 0 },
    n_forus: { type: Number, default: 0 },
    mean_score: { type: Number, default: -1 },
    users: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    universities: [{
        _id: ObjectId,
        name: String,
        url: String,
        logo: String
    }],
    forus: [{
        _id: ObjectId,
        image: String,
        name: String
    }],
    photos: [{
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }],
    forums: [{
        type: Schema.Types.ObjectId,
        ref: 'Forum'
    }],
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }]
}, {
    timestamps: true
});

module.exports = model('Destination', destinationSchema);
