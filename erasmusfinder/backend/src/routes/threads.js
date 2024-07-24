const auth = require('../middleware/auth.js');
const { Router } = require('express');
const router = Router();

const uploadThread = require('../middleware/uploadThread');

router.post('/upload-thread-photo', uploadThread.single('photo'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No se ha proporcionado ningún archivo' });
    }

    const photoUrl = `/imgs/threads/${req.file.filename}`;

    res.json({ url: photoUrl });
});

const {
    createThread,
    getThread,
    getThreads,
    deleteThread,
    updateThread
} = require('../controller/thread.controller.js');

router.route('/')
    .get(getThreads)
    .post(createThread);

router.route('/:id')
    .get(getThread)
    .delete(deleteThread)
    .put(updateThread)

module.exports = router;