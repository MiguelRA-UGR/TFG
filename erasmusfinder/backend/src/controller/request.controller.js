const jwt = require('jsonwebtoken');
const requestCtrlr = {};
const Request = require('../models/Request');
const auth = require('../middleware/auth');

// GET
requestCtrlr.getRequests = async (req, res) => {
    try {
        const requests = await Request.find();
        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// POST
requestCtrlr.createRequest = async (req, res) => {
    try {
        const { user, type, comment, destination, reported} = req.body;

        const newRequest = new Request({ 
            user, 
            comment, 
            type, 
            destination,
            reported
        });

        await newRequest.save();

        res.json({ message: "Petición creada" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// GET by ID
requestCtrlr.getRequest = async (req, res) => {
    try {
        const request = await Request.findById(req.params.id);
        if (request === null) {
            return res.status(404).json({ message: "Petición no encontrada" });
        }
        res.json(request);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// DELETE
requestCtrlr.deleteRequest = async (req, res) => {
    try {
        const request = await Request.findById(req.params.id);
        
        if (!request) {
            return res.status(404).json({ message: "Petición no encontrada" });
        }

        await Request.findByIdAndDelete(req.params.id);

        res.json({ message: "Petición eliminada" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar la petición", error });
    }
};

// APPROVE
requestCtrlr.approveRequest = async (req, res) => {
    try {
        const request = await Request.findById(req.params.id);
        
        if (!request) {
            return res.status(404).json({ message: "Petición no encontrada" });
        }

        await Request.findByIdAndDelete(req.params.id);

        res.json({ message: "Petición eliminada" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar la petición", error });
    }
};



//Exportar el controlador de Peticiones
module.exports = requestCtrlr;