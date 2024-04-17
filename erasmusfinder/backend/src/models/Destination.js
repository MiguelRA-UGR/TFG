const { Schema, model, ObjectId } = require('mongoose');

const destinationSchema = new Schema({
    name: { type: String, required: true},
    description: { type: String, required:false},
    country: { type: String, required:true},
    coords: {
        lat: { type: Number, required:true},
        long: { type: Number, required:true}
    },
    population: { type: String },
    cost_life: { type: String },
    surface: { type: String },
    climate: { type: String },
    languages: [{ type: String }],
    n_users: { type: Number, default: 0 },
    n_forus: { type: Number, default: 0 },
    universities: [{
        nombre_universidad: String
    }],
    mean_score: { type: Number, default: 0 },
    users: [{
        _id: ObjectId,
        name: String,
        photo: String,
        state: String
    }],
    forus: [{
        _id: ObjectId,
        image: String,
        name: String
    }],
    reviews: [{
        _id: ObjectId,
        comment: String,
        score: { type: Number, default: 0 }
    }]
}, {
    timestamps: true
});

module.exports = model('Destination', destinationSchema);
