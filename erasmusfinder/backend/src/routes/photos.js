const auth = require('../middleware/auth.js');
const { Router } = require('express');
const router = Router();
const uploadPost = require('../middleware/uploadPost');

router.post('/upload-post-photo', uploadPost.single('photo'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No se ha proporcionado ningún archivo' });
    }

    const photoUrl = `/imgs/posts/${req.file.filename}`;

    res.json({ url: photoUrl });
});

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

router.post('/photo', uploadPhoto)
router.put('/like', likePhoto)
router.put('/dislike', disLikePhoto)

module.exports = router;