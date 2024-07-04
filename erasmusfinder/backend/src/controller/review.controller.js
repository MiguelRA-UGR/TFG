const jwt = require('jsonwebtoken');
const reviewCtrlr = {};
const Review = require('../models/Review');
const Destination = require('../models/Destination');
const User = require('../models/User');

// GET
reviewCtrlr.getReviews = async (req, res) => {
    try {
        const reviews = await Review.find();
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET by destination
reviewCtrlr.getReviewsByDestination = async (req, res) => {
    try {
        const { destinationId } = req.params;
        const reviews = await Review.find({ destination: destinationId });
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// POST
reviewCtrlr.createReview = async (req, res) => {
    try {
        const { destination, comment, score, user, anonymous } = req.body;

        const newReview = new Review({ 
            destination, 
            comment, 
            score, 
            user,
            anonymous 
        });

        const dest = await Destination.findById(destination);
        const author = await User.findById(user);

        await newReview.save();

        dest.reviews.push(newReview._id);
        author.reviews.push(newReview._id)
        await dest.save();
        await author.save();

        if (score > -1 && score <= 10 ) {
            //Actualizar puntuacion del destino
            const reviews = await Review.find({ destination });
            const meanScore = reviews.reduce((acc, review) => acc + review.score, 0) / reviews.length;
            await Destination.findByIdAndUpdate(destination, { mean_score: meanScore });
        }

        res.json({ message: "Reseña creada" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// GET by ID
reviewCtrlr.getReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);
        if (review === null) {
            return res.status(404).json({ message: "Reseña no encontrada" });
        }
        res.json(review);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// DELETE
reviewCtrlr.deleteReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);
        
        if (!review) {
            return res.status(404).json({ message: "Reseña no encontrada" });
        }

        await Review.findByIdAndDelete(req.params.id);

        const dest = await Destination.findById(destinationId);

        dest.reviews = dest.reviews.filter(reviewId => reviewId.toString() !== reviewId);
        await dest.save();

        // Borrar la reseña en el destino y calcular la nueva puntuación media
        const reviews = await Review.find({ destination: review.destination });
        const meanScore = reviews.length > 0 
            ? reviews.reduce((acc, review) => acc + review.score, 0) / reviews.length 
            : -1;

        await Destination.findByIdAndUpdate(review.destination, { mean_score: meanScore });

        res.json({ message: "Reseña eliminada y puntuación media actualizada" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//Exportar el controlador de usuario
module.exports = reviewCtrlr;