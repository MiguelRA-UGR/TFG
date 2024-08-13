const {Schema, model} = require('mongoose')

const userSchema = new Schema({
    userName: { type: String, required: true },
    admin: { type: Boolean,default:false, required:true },
    photo: { type: Boolean, default: false },
    email: { type: String, required: true },
    password: { type: String, required: true },
    nationality: { type: String },
    occupation: { type: String },
    badge: { type: String, default: "newbie" },
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
    warningsN:{type:Number,default:0},
    pendingContact: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    incomingContactRequest: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    notifications: [{
        type: Schema.Types.ObjectId,
        ref: 'Notification'
    }],
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
    photos: [{
        type: Schema.Types.ObjectId,
        ref: 'Photo'
    }],
    likedPhotos: [{
        type: Schema.Types.ObjectId,
        ref: 'Photo'
    }],
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }],
    followedForums: [{
        type: Schema.Types.ObjectId,
        ref: 'Forum'
    }]
}, {
    timestamps: true
});

//Exportarlo para poder usar el esquema de usuario en el controlador
module.exports = model('User', userSchema);
