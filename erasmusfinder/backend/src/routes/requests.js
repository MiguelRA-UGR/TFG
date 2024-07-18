const auth = require('../middleware/auth.js');
const { Router } = require('express');
const router = Router();
const {
    createRequest,
    deleteRequest,
    getRequests,
    getRequest,
    approveRequest
} = require('../controller/request.controller.js');

router.route('/')
    .get(getRequests);

router.route('/:id')
    .get(getRequest)
    .delete(deleteRequest)
    .delete(approveRequest);
router.post('/request', createRequest);


module.exports = router;