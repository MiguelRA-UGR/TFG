const auth = require('../middleware/auth.js');
const { Router } = require('express');
const router = Router();
const uploadForum = require('../middleware/uploadForum');

router.post('/upload-forum-photo', uploadForum.single('photo'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No se ha proporcionado ningún archivo' });
    }

    const photoUrl = `/imgs/forums/${req.file.filename}`;

    res.json({ url: photoUrl });
});

const {
    createForum,
    getForum,
    getForums,
    deleteForum,
    updateForum
} = require('../controller/forum.controller.js');

router.route('/')
    .get(getForums)
    .post(createForum);

router.route('/:id')
    .get(getForum)
    .delete(deleteForum)
    .put(updateForum)

module.exports = router;