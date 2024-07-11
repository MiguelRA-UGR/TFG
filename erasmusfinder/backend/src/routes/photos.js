const auth = require('../middleware/auth.js');
const { Router } = require('express');
const router = Router();
const {
    uploadPhoto,
    getPhoto,
    getPhotos,
    getPhotosByDestination,
    deletePhoto,
    likePhoto,
    disLikePhoto
} = require('../controller/photo.controller.js');

router.route('/')
    .get(getPhotos)
    .post(uploadPhoto);

router.route('/:id')
    .get(getPhoto)
    .get(getPhotosByDestination)
    .delete(deletePhoto)
    .put(likePhoto)
    .put(disLikePhoto)

module.exports = router;