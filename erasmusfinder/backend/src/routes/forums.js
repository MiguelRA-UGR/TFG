const auth = require('../middleware/auth.js');
const { Router } = require('express');
const router = Router();

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