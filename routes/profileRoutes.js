const express = require('express');
const router = express.Router();
const authJWT = require('../middleware/authenticator');
const multer = require('multer');
const { storage } = require('../middleware/cloudinary');
const upload = multer({
  storage,
  limits: { fileSize: 3 * 1024 * 1024 },
  fileFilter(req,file, cb) {
    if (!file.originalname.match(/\.(gif|jpe?g|png)$/i)) {
      return cb(new Error("file must be an image"));
    }
    return cb(null, true);
  }
});

const { createProfileValidator, editProfileValidator, validatorResult } = require('../middleware/validator');
const { getProfile, getAllProfiles, getProfileById, allFollowedProfiles, allFollowersProfiles, followProfile, createProfile, editProfile, deleteProfile, unfollowProfile } = require('../controllers/profileController');

// @route    GET profile/me ~ settings page...
// @desc     Get current users profile (by user id token), leads to dashboard for editing profile via settings
// @access   Private
router.get('/me', authJWT, getProfile);

// @route    GET profile (endpoint: /profile)
// @desc     Get all profiles
// @access   Public
router.get('/', getAllProfiles);

// @route    GET api/profile/user/:user_id
// @desc     Get profile by user ID
// @access   Public
router.get('/user/:user_id', getProfileById);

// @route    GET profile/all-followed-members
// @desc     list all members you follow
// @access   private
router.get('/all-followed-users', authJWT, allFollowedProfiles);

// @route    GET profile/all-followed-members
// @desc     list all members following you
// @access   private
router.get('/all-following-me', authJWT, allFollowersProfiles);

// @route    GET profile/follow/:user_id
// @desc     follow user
// @access   Private
router.get('/follow/:user_id', authJWT, followProfile);

// @route    POST profile
// @desc     Create user profile - use auth & check/validation middlewares
// @access   Private
router.post('/', authJWT, upload.single('background_image'), createProfileValidator, validatorResult, createProfile);

// @route    PUT profile
// @desc     Update user profile - use validation middlewares
// @access   Private
router.put('/me', authJWT, upload.fields([{name: 'user_avatar'}, {name: 'background_image'}]), editProfileValidator, validatorResult, editProfile);

// @route    DELETE api/profile
// @desc     Delete profile, user, and posts
// @access   Private
router.delete('/', authJWT, deleteProfile);

// @route    DELETE profile/unfollow/:user_id
// @desc     follow/unfollow button
// @access   Private
router.delete('/unfollow/:user_id', authJWT, unfollowProfile);

module.exports = router;