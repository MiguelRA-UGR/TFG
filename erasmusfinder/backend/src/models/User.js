const {Schema, model} = require('mongoose')

//Falta añadir todos los atributos de un usuario y añadir el resto de modelos

const userSchema = new Schema({
    userName: { type: String, required: true },
    userType: { type: String },
    photo: { type: Boolean, default: false },
    email: { type: String, required: true },
    password: { type: String, required: true },
    nationality: { type: String },
    state: { type: String },
    description: { type: String },
    instagram: { type: String },
    facebook: { type: String },
    linkedin: { type: String },
    followedUsers: [{
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
