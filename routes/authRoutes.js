const express = require('express');
const router = express.Router();
const authJWT = require('../middleware/authenticator');
const { signinAuthValidator, validatorResult } = require('../middleware/validator');
const { authDemo, authTest, authValidToken, authRefreshToken, authLogout } = require('../controllers/authController');

// @route    GET auth/demo
// @desc     use demo account (login)
// @access   Public
router.get('/demo', authDemo);

// @route    GET auth (endpoint: auth)
// @desc     Test route / verify / backend / user_loaded
// @access   Private
router.get('/', authJWT, authTest);

// @route    POST auth
// @desc     Authenticate users already in db (login) and get token (to make req to private routes)
// @access   Public
router.post('/', signinAuthValidator, validatorResult, authValidToken);

// @route    POST auth/refresh-token
// @desc     Generate new access (upon expiration) & refresh token
// @access   Public
router.post('/refresh-token', authRefreshToken);

// @route    POST auth/logout
// @desc     Logout, destroy or 'null' refresh token from db belonging to user
// @access   Public
router.post('/logout', authLogout);

module.exports = router;