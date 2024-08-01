const auth = require('../middleware/auth.js');
const { Router } = require('express');
const router = Router();
const uploadDest = require('../middleware/uploadDest');
const {
    createDestination,
    getDestinations,
    getDestination,
    deleteDestination,
    updateDestination,
} = require('../controller/destination.controller.js');

router.post('/upload-dest-photo', uploadDest.single('photo'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No se ha proporcionado ningún archivo' });
    }

    const photoUrl = `/imgs/frontpages/${req.file.filename}`;

    res.json({ url: photoUrl });
});

router.route('/')
    .get(getDestinations)
    .post(createDestination);

router.route('/:id')
    .get(getDestination)
    .delete(deleteDestination)
    .put(updateDestination);

module.exports = router;
