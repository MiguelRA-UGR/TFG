const jwt = require('jsonwebtoken');
const destinationCtrlr = {};
const Destination = require('../models/Destination');

// GET
destinationCtrlr.getDestinations = async (req, res) => {
    try {
        const destinations = await Destination.find();
        res.json(destinations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// POST
destinationCtrlr.createDestination = async (req, res) => {
    try {
        const { 
            name, 
            description, 
            country,
            coords,
            population,
            cost_life,
            surface,
            clima,
            languages,
            universities,
            n_users,
            n_forus,
            mean_score,
            users,
            forus,
            reviews 
        } = req.body;
        const newDestination = new Destination({ 
            name,
            description, 
            country,
            coords,
            population,
            cost_life,
            surface,
            clima,
            languages,
            universities,
            n_users,
            n_forus,
            mean_score,
            users,
            forus,
            reviews 
        });
        await newDestination.save();
        res.json({ message: "Destino creado" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// GET by ID
destinationCtrlr.getDestination = async (req, res) => {
    try {
        const destination = await Destination.findById(req.params.id);
        if (destination === null) {
            return res.status(404).json({ message: "Destino no encontrado" });
        }
        res.json(destination);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// DELETE
destinationCtrlr.deleteDestination = async (req, res) => {
    try {
        await Destination.findByIdAndDelete(req.params.id);
        res.json({ message: "Destino eliminado" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// PUT
destinationCtrlr.updateDestination = async (req, res) => {
    try {
        const { 
            name, 
            description, 
            country,
            coords,
            population,
            cost_life,
            surface,
            clima,
            languages,
            universities,
            n_users,
            n_forus,
            mean_score,
            users,
            forus,
            reviews 
        } = req.body;

        await Destination.findByIdAndUpdate(req.params.id, { 
            name,
            description, 
            country,
            coords,
            population,
            cost_life,
            surface,
            clima,
            languages,
            universities,
            n_users,
            n_forus,
            mean_score,
            users,
            forus,
            reviews 
        });

        res.json({ message: "Destino actualizado" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Export destination controller
module.exports = destinationCtrlr;
