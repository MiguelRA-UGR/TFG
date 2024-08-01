const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../../public/imgs/frontpages'));
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);

        const newFileName = `${file.originalname}`;
        cb(null, newFileName);
    }
});

const uploadForum = multer({ storage: storage });

module.exports = uploadForum;