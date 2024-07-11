const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../../public/imgs/posts'));
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        const newFileName = `${Date.now()}${ext}`;
        cb(null, newFileName);
    }
});

const uploadPost = multer({ storage: storage });

module.exports = uploadPost;
