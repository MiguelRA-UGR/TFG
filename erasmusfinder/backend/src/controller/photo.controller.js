const jwt = require('jsonwebtoken');
const photoCtrlr = {};
const Photo = require('../models/Photo');
const Destination = require('../models/Destination');
const User = require('../models/User');

// GET
photoCtrlr.getPhotos = async (req, res) => {
    try {
        const photos = await Photo.find();
        res.json(photos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET by destination
photoCtrlr.getPhotosByDestination = async (req, res) => {
    try {
        const { destinationId } = req.params;
        const photos = await Photo.find({ destination: destinationId });
        res.json(photos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// POST
photoCtrlr.uploadPhoto = async (req, res) => {
    try {
        const { url, destination, ubication,comment, likes, user, anonymous } = req.body;

        const author = await User.findById(user);
        
        const newPhoto = new Photo({ 
            url,
            destination, 
            ubication, 
            comment,
            likes,
            user,
            anonymous 
        });
        
        const dest = await Destination.findById(destination);
        
        await newPhoto.save();

        dest.photos.push(newPhoto._id);
        author.photos.push(newPhoto._id)
        await dest.save();
        await author.save();

        res.json({ message: "Foto subida" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// GET by ID
photoCtrlr.getPhoto = async (req, res) => {
    try {
        const photo = await Photo.findById(req.params.id);
        if (photo === null) {
            return res.status(404).json({ message: "Foto no encontrada" });
        }
        res.json(photo);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// DELETE
photoCtrlr.deletePhoto = async (req, res) => {
    try {
        const photo = await Photo.findById(req.params.id);
        
        if (!photo) {
            return res.status(404).json({ message: "Foto no encontrada" });
        }

        await Photo.findByIdAndDelete(req.params.id);

        const dest = await Destination.findById(photo.destination);

        dest.photos.pull(photo._id);
        await dest.save();

        const author = await User.findById(photo.user);

        author.photos.pull(photo._id);
        await author.save();

        res.json({ message: "Foto eliminada" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar la photo", error });
    }
};

// LIKE
photoCtrlr.likePhoto = async (req, res) => {
    try {
        const photo = await Photo.findById(req.body.photoId);

        if (!photo) {
            return res.status(404).json({ message: "Foto no encontrada" });
        }

        if (!photo.likes.includes(req.body.userId)) {
            photo.likes.push(req.body.userId);
        }

        await photo.save();

        res.json({ message: "Foto con me gusta correcto", nLikes: photo.likes.length });
    } catch (error) {
        res.status(500).json({ message: "Error al dar like", error });
    }
};


// DISLIKE
photoCtrlr.disLikePhoto = async (req, res) => {
    try {
        const photo = await Photo.findById(req.body.photoId);

        if (!photo) {
            return res.status(404).json({ message: "Foto no encontrada" });
        }

        photo.likes.pull(req.body.userId)

        await photo.save();

        res.json({ message: "Foto con me gusta quitado correctamente", nLikes: photo.likes.length });
    } catch (error) {
        
        res.status(500).json({ message: "Error al quitar like", error });
    }
};

//Exportar el controlador de las fotos
module.exports = photoCtrlr;