const forumCtrlr = {};
const Forum = require('../models/Forum');
const Destination = require('../models/Destination');
const Thread = require('../models/Thread');

// GET
forumCtrlr.getForums = async (req, res) => {
    try {
        const forums = await Forum.find();
        res.json(forums);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// POST
forumCtrlr.createForum = async (req, res) => {
    try {
        const { 
            title,
            destination, 
            description, 
            url
        } = req.body;
        const newForum = new Forum({ 
            title,
            destination,
            description,
            url
        });
        await newForum.save();

        const dest = await Destination.findById(destination);
        
        dest.forums.push(newForum._id);
        await dest.save();

        res.json({ message: "Foro creado" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// GET
forumCtrlr.getForum = async (req, res) => {
    try {
        const forum = await Forum.findById(req.params.id);
        if (forum === null) {
            return res.status(404).json({ message: "Foro no encontrado" });
        }
        res.json(forum);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// DELETE
forumCtrlr.deleteForum = async (req, res) => {
    try {

        const forum = await Forum.findById(req.params.id);

        await Forum.findByIdAndDelete(req.params.id);

        // Eliminar los hilos 
        await Thread.deleteMany({ forum: req.params.id });

        //Eliminar también el foro del destino
        const dest = await Destination.findById(forum.destination);

        dest.forums.pull(forum._id);
        await dest.save();

        res.json({ message: "Foro eliminado" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// PUT
forumCtrlr.updateForum = async (req, res) => {
    try {
        const { 
            title,
            users, 
            threads,
            url,
            description
        } = req.body;

        await Forum.findByIdAndUpdate(req.params.id, { 
            title,
            users, 
            threads,
            url,
            description
        });

        res.json({ message: "Foro actualizado" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = forumCtrlr;
