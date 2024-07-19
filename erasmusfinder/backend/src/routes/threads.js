const auth = require('../middleware/auth.js');
const { Router } = require('express');
const router = Router();

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