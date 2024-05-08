const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../../public/imgs/users'));
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        const newFileName = `${req.params.id}${ext}`;
        cb(null, newFileName);
    }
});


const upload = multer({ storage: storage });

module.exports = upload;
