const auth = require('../middleware/auth.js');
const { Router } = require('express');
const router = Router();
const {
    createReview,
    getReview,
    getReviews,
    getReviewsByDestination,
    deleteReview,
} = require('../controller/review.controller.js');

router.route('/')
    .get(getReviews);

router.route('/:id')
    .get(getReview)
    .get(getReviewsByDestination)
    .delete(deleteReview);
router.post('/review', createReview);


module.exports = router;