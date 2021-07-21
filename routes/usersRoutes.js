const express = require('express');
const router = express.Router();
const multer = require('multer');
const { storage } = require('../middleware/cloudinary');
const upload = multer({ storage, limits: { fieldSize: 3 * 1024 * 1024 } }); //3MB
const { registerUserValidator, validatorResult } = require('../middleware/validator');
const { registerUser } = require('../controllers/userController');
const authJWT = require('../middleware/authenticator');

// @POST '/users'
// @desc - register a user
// @access - Public
router.post('/', upload.single('avatar'), registerUserValidator, validatorResult, registerUser);

module.exports = router;