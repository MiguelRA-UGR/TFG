const auth = require('../middleware/auth.js');

//Enrutador a través de express
const {Router} = require('express');
const router = Router();
const upload = require('../middleware/upload');

const { createUser, getUsers, getUser, deleteUser, updateUser, updateProfilePicture, logIn, signUp, contact, breakcontact, sendrequest, makeAdmin, warnUser} = require('../controller/user.controller')

router.route('/')
    .get(getUsers)
    .post(createUser)

router.put('/:id/profile-picture', upload.single('profilePicture'), updateProfilePicture);

router.route('/:id')
    .get(getUser)
    .delete(deleteUser)
    .put(updateUser);

router.post('/login', logIn);
router.post('/signup', signUp);

router.post('/contact', contact);
router.post('/breakcontact', breakcontact);
router.post('/sendrequest', sendrequest);

router.put('/makeadmin/:id', makeAdmin);
router.put('/warnuser/:id', warnUser);


//Exportar el router para utilizarlo en otras partes
module.exports = router;