const auth = require('../middleware/auth.js');
const { Router } = require('express');
const router = Router();
const {
    createDestination,
    getDestinations,
    getDestination,
    deleteDestination,
    updateDestination,
} = require('../controller/destination.controller.js');

router.route('/')
    .get(getDestinations)
    .post(createDestination);

router.route('/:id')
    .get(getDestination)
    .delete(deleteDestination)
    .put(updateDestination);

module.exports = router;
