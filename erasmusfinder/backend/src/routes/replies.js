const auth = require('../middleware/auth.js');
const { Router } = require('express');
const router = Router();

const {
    createReply,
    getReply,
    getReplies,
    deleteReply,
    updateReply
} = require('../controller/reply.controller.js');

router.route('/')
    .get(getReplies)
    .post(createReply);

router.route('/:id')
    .get(getReply)
    .delete(deleteReply)
    .put(updateReply)

module.exports = router;