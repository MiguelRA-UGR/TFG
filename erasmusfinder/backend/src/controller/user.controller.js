const jwt = require('jsonwebtoken');

const userCtrlr = {}
const bcrypt = require('bcrypt');
const User = require('../models/User');
const fs = require('fs');
const path = require('path');
const upload = require('../middleware/upload');

//LOGIN
userCtrlr.logIn = async(req, res) =>{
    const {email, password} = req.body;
    
    try{
        const existingUser = await User.findOne({email});

        if(!existingUser) return res.status(404).json({message: "El usuario no existe"})

        const correctPassword = await bcrypt.compare(password, existingUser.password);

        if(!correctPassword) return res.status(400).json({message: "La contraseña o el usuario no son correctos"})

        //JWT para mantener al usuario conectado durante una hora
        const token = jwt.sign({email: existingUser.email, id: existingUser._id}, 'test', {expiresIn : "1h" })


        res.status(200).json({result: existingUser, token})
    }catch(error){
        res.status(500).json({message: 'Algo no ha ido bien'});
    }
}

//SIGNUP
userCtrlr.signUp = async(req, res) =>{
    const { email, password, userName} = req.body;

    console.log("Hola");

    try {
        const existingUser = await User.findOne({email});

        if(existingUser) return res.status(400).json({message: "Ya existe una cuenta con este correo"});

        //Hashear la contraseña
        const hashedPassword = await bcrypt.hash(password,12);

        const result = await User.create({
            email,
            password: hashedPassword,
            userName
        });

        const token = jwt.sign({email: result.email, id: result._id}, 'test', {expiresIn : "1h"});

        res.status(200).json({result: result, token});

    } catch (error) {
        res.status(500).json({message: 'Algo no ha ido bien'});
    }
}

//GET
userCtrlr.getUsers = async(req, res) =>{
    const users = await User.find();
    //Devolver usuarios de la coleccion en forma de json
    res.json(users);
}
//POST
userCtrlr.createUser = async(req, res) =>{
    const {userName} = req.body;
    const newUser = new User({
        userName: userName
    })

    await newUser.save();
    res.json({message: "Creado nuevo usuario"});
}
//GET
userCtrlr.getUser = async(req, res) =>{
    const user = await User.findById(req.params.id);
    res.json(user);
    
}
//DELETE
userCtrlr.deleteUser = async(req, res) =>{
    await User.findByIdAndDelete(req.params.id)
    res.json({message: "Usuario eliminado"});
}
//PUT
userCtrlr.updateUser = async(req, res) => {
    const userId = req.params.id;
    const updates = req.body;

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        if (req.file) {
            const profilePicture = req.file;
            const ext = path.extname(profilePicture.originalname);
            const fileName = userId + ext;

            fs.renameSync(profilePicture.path, path.join(__dirname, `../public/imgs/users/${fileName}`));
            user.profilePicture = fileName;
        }

        Object.keys(updates).forEach(key => {
            if (updates[key] !== undefined && key !== 'profilePicture') {
                user[key] = updates[key];
            }
        });

        await user.save();

        res.json({ message: 'Usuario actualizado correctamente' });
    } catch (error) {
        console.error('Error al actualizar el usuario:', error);
        res.status(500).json({ message: 'Algo salió mal al actualizar el usuario' });
    }
};

// PUT para actualizar la foto de perfil
userCtrlr.updateProfilePicture = async (req, res) => {
    const userId = req.params.id;

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        if (!req.file) {
            user.photo = false;
        }else{

            const profilePicture = req.file;

            const fileName = req.file.filename;
            user.photo = true;
            await user.save();

            res.json({ message: 'Foto de perfil actualizada correctamente' });
        }
    } catch (error) {
        console.error('Error al actualizar la foto de perfil:', error);
        res.status(500).json({ message: 'Algo salió mal al actualizar la foto de perfil' });
    }
};


//Exportar el controlador de usuario
module.exports = userCtrlr;