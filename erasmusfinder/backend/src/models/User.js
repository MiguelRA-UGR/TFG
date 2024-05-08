const {Schema, model} = require('mongoose')

const userSchema = new Schema({
    userName: { type: String, required: true },
    userType: { type: String,default:0 },
    photo: { type: Boolean, default: false },
    email: { type: String, required: true },
    password: { type: String, required: true },
    nationality: { type: String },
    badge: { type: String },
    state: { type: Number ,default:0},
    privacy: { type: Number ,default:0},
    description: { type: String },
    instagram: { type: String },
    facebook: { type: String },
    linkedin: { type: String },
    twitter: { type: String },
    originCity: { type: String,default:"none" },
    destCity: { type: String,default:"none" },
    destUniversity: { type: String,default:"none" },
    followedUsers: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    followingUsers: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    followedDestinations: [{
        type: Schema.Types.ObjectId,
        ref: 'Destination'
    }],
    followedForus: [{
        forusName: String
    }]
}, {
    timestamps: true
});

//Exportarlo para poder usar el esquema de usuario en el controlador
module.exports = model('User', userSchema);
