const express = require('express');
const router = express.Router();
const authJWT = require('../middleware/authenticator');
const multer = require('multer');
const { storage } = require('../middleware/cloudinary');
const upload = multer({
  storage,
  limits: { fieldSize: 3 * 1024 * 1024 },
  fileFilter(req,file, cb) {
    if (!file.originalname.match(/\.(gif|jpe?g|png)$/i)) {
      return cb(new Error("file must be an image"));
    }
    return cb(null, true);
  }
}); //3MB
const { createPostValidator, validatorResult } = require('../middleware/validator');
const { getAllFollowingPosts, getPostById, createPost, createPostComment, postLikeStatus, updatePostById, likePost, unlikePost, updatePostComment, likeComment, unlikeComment,  deletePostById, deletePostComment } = require('../controllers/postController');

// @route    GET posts of users you follow, 
// @desc     Show all acct posts. This is central feed
// @access   Private - members only
router.get('/', authJWT, getAllFollowingPosts);

// @route    GET posts/:post_id
// @desc     Get post by user ID. Go to user page and load their posts in a comp placed in the user porfile comp 
// @access   Private
router.get('/:post_id', authJWT, getPostById);

// @route    POST posts
// @desc     Create a post. Name & avatar associated w/post is validated via request w/user.id from a token.
// @access   Private
router.post('/', authJWT, upload.single('image_url'), createPostValidator, validatorResult,  createPost);

// @route    POST posts/comment/:post_id
// @desc     Post comment of user post based on id. 
// @access   Private
router.post("/comment/:post_id", authJWT, upload.single('image_url'), createPostValidator, validatorResult, createPostComment);

// @route    PUT posts/:post_id
// @desc     Update - change the content of a user's post by user id
// @access   Private
router.put('/:post_id', authJWT, upload.single('image_url'), createPostValidator, validatorResult, updatePostById);

// @route    PUT posts/like/:post_id
// @desc     Update - like a post. 
// @access   Private
router.put("/like/:post_id", authJWT, likePost);

// @route    PUT posts/unlike/:id
// @desc     Unlike post - check if post has been liked, cannot unlike post not already liked 
// @access   Private
router.delete("/unlike/:post_id", authJWT, unlikePost);

// @route    PUT comment/like/:id
// @desc     Update - like a post comment. 
// @access   Private
router.put("/comment/like/:comment_id", authJWT, likeComment);

// @route    PUT posts/comment/unlike/:id
// @desc     Unlike post comment -check if post has been liked, cannot unlike post not already liked 
// @access   Private
router.delete("/comment/unlike/:comment_id", authJWT, unlikeComment);

// @route    PUT posts/comment/:post_id/:comment_id
// @desc     Update comment of user post based on id. 
// @access   Private
router.put("/comment/:post_id/:comment_id", authJWT, upload.single('image_url'), createPostValidator, updatePostComment);

// @route    DELETE posts/delete/:post_id
// @desc     Delete post by ID. 
// @access   Private
router.delete('/delete/:post_id', authJWT, deletePostById);

// @route    DELETE posts/delete/comment/:post_id/:comment_id
// @desc     Find post by id and then comment by id
// @access   Private
router.delete('/delete/comment/:post_id/:comment_id', authJWT, deletePostComment);

module.exports = router;