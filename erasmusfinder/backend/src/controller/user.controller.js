const jwt = require('jsonwebtoken');

const userCtrlr = {}
const bcrypt = require('bcrypt');
const User = require('../models/User');
const fs = require('fs');
const path = require('path');
const upload = require('../middleware/upload');
const Review = require('../models/Review');

//LOGIN
userCtrlr.logIn = async(req, res) =>{
    const {email, password} = req.body;
    
    try{
        const existingUser = await User.findOne({email});

        if(!existingUser) return res.status(404).json({message: "The user does not exist"})

        const correctPassword = await bcrypt.compare(password, existingUser.password);

        if(!correctPassword) return res.status(400).json({message: "Incorrect password or user name"})

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

    try {
        const existingUser = await User.findOne({email});

        if(existingUser) return res.status(400).json({message: "There is already an account with this email address"});

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
userCtrlr.deleteUser = async(req, res) => {
    try {
      const userId = req.params.id;
  
      await User.findByIdAndDelete(userId);
  
      // Eliminar las fotos y reseñas del usuario
      await Photo.deleteMany({ user: userId });
      await Review.deleteMany({ author: userId });
  
      res.json({ message: "Usuario eliminado" });
    } catch (error) {
      res.status(500).json({ message: "Error al eliminar el usuario" });
    }
  };

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

// Crear un nuevo contacto
userCtrlr.contact = async (req, res) => {
    try {
        const { snd, rcv} = req.body;
        const sender = await User.findById(snd);
        const receiver = await User.findById(rcv);

        sender.followedUsers.push(rcv);
        sender.followingUsers.push(rcv);

        receiver.followedUsers.push(snd);
        receiver.followingUsers.push(snd);

        receiver.incomingContactRequest.pull(snd._id);
        sender.pendingContact.pull(rcv._id);

        await sender.save();
        await receiver.save();

        res.json({ message: 'Contacto establecido correctamente' });

    } catch (error) {
        console.error('Error al establecer contacto con usuario:', error);
        res.status(500).json({ message: 'Algo salió mal al intentar establecer contacto con usuario' });
    }
};

// Romper un contacto existente
userCtrlr.breakcontact = async (req, res) => {
    try {
        const { snd, rcv} = req.body;
        const sender = await User.findById(snd);
        const receiver = await User.findById(rcv);

        receiver.incomingContactRequest.pull(snd);
        sender.pendingContact.pull(rcv);

        sender.followedUsers.pull(rcv);
        sender.followingUsers.pull(rcv);

        receiver.followedUsers.pull(snd);
        receiver.followingUsers.pull(snd);

        await sender.save();
        await receiver.save();

        res.json({ message: 'Contacto eliminado correctamente' });

    } catch (error) {
        console.error('Error al eliminar el contacto con usuario:', error);
        res.status(500).json({ message: 'Algo salió mal al intentar romper contacto con usuario' });
    }
};

// Enviar una solicitud de contacto
userCtrlr.sendrequest = async (req, res) => {
    try {

        const { snd, rcv} = req.body;
        const sender = await User.findById(snd);
        const receiver = await User.findById(rcv);

        if (!sender.pendingContact.includes(rcv)) {
            sender.pendingContact.push(rcv);
        }

        if (!receiver.incomingContactRequest.includes(snd)) {
            receiver.incomingContactRequest.push(snd);
        }

        await sender.save();
        await receiver.save();

        res.json({ message: 'Solicitud de contacto enviada correctamente' });
    } catch (error) {
        console.error('Error al enviar la solicitud de contacto:', error);
        res.status(500).json({ message: 'Algo salió mal al enviar la solicitud de contacto' });
    }
};

// Designar como administrador
userCtrlr.makeAdmin = async (req, res) => {
    try {
        const userId = req.params.id;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

        user.admin = !user.admin;
        await user.save();

        res.json({ message: 'Condición de usuario cambiada correctamente' });
    } catch (error) {
        console.error('Error al intentar promover a administrador:', error);
        res.status(500).json({ message: 'Algo salió mal al intentar hacer administrador al usuario' });
    }
}

// Crear una advertencia para un usuario
userCtrlr.warnUser = async (req, res) => {
    try {
        const userId = req.params.id;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

        user.warningsN+=1;
        await user.save();

        res.json({ message: 'Usuario advertido correctamente' });
    } catch (error) {
        console.error('Error al advertir al usuario:', error);
        res.status(500).json({ message: 'Algo salió mal al advertir al usuario' });
    }
}

module.exports = userCtrlr;