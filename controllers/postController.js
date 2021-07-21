const pool = require("../config/db");
const cloudinary = require('cloudinary').v2;

// get all user post and all post of users being followed
// postan tested passed
exports.getAllFollowingPosts = async (req, res, next) => {
  const { id } = req.user;
  try {
    // implement username, tag_name, and avatar from users table into this query, when such data is updated it reflects universally in the feed or other lists
    const postsInfo = await pool.query(
      'SELECT P.*, U.username, U.tag_name, U.user_avatar FROM posts AS P JOIN users AS U ON P.user_id = U.id WHERE U.id = $1 UNION SELECT P.*, U.username, U.tag_name, U.user_avatar FROM posts AS P JOIN users AS U ON P.user_id = U.id JOIN follows ON P.user_id = follows.following_id WHERE follows.follower_id = $1 ORDER BY created_at DESC;', [id]
    );
    if (postsInfo.rows.length > 0) {
      const queryPromise = (query, ...values) => {
        return new Promise((resolve, reject) => {
          pool.query(query, values, (err, res) => {
            if (err) {
              reject(err);
            } else {
              resolve(res);
            }
          })
        });
      };

      for (let i = 0; i < postsInfo.rows.length; i++) {
        const postsLikes = 'SELECT id, post_like, user_id FROM likes WHERE likes.post_like = $1;';

        const postsComments = 'SELECT C.*, U.username, U.tag_name, U.user_avatar FROM comments AS C JOIN users AS U ON C.user_id = U.id WHERE C.post_id = $1;';
        
        const postsLikesProm = await queryPromise(postsLikes, postsInfo.rows[i].id);
        
        const postsCommentsProm = await queryPromise(postsComments, postsInfo.rows[i].id); 
        
        let postLikes = postsLikesProm.rows;
        let postComments = postsCommentsProm.rows;
        
        // * this works best, includes stats of likes & comments, narrow down stats for both
        postsInfo.rows[i] = { ...postsInfo.rows[i], postLikes, postComments };
      }

      for (let i = 0; i < postsInfo.rows.length; i++) {
        let created_at = postsInfo.rows[i].created_at;
        let newCreatedAt = created_at.toISOString().slice(0, 10);
        postsInfo.rows[i].created_at = newCreatedAt;
      }
    }
    res.status(200).json({
      success: "Success! Here are all your posts.",
      data: {
        posts: postsInfo.rows
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error...');
  }
}

// postman tested and passed
exports.getPostById = async (req, res, next) => {
  // const { id } = req.user;
  try {
    // get id value from url & post info
    const { post_id } = req.params;
    const postById = await pool.query(
      'SELECT P.*, U.username, U.tag_name, U.user_avatar FROM posts AS P JOIN users AS U ON P.user_id = U.id WHERE P.id = $1;', [post_id]
    );

    // check if post with id exists
    if (!postById.rows.length > 0) {
      return res.status(400).json({ errors: [{ msg: "Post not found." }] });
    }

    let created_at = postById.rows[0].created_at;
    let newCreatedAt = created_at.toISOString().slice(0, 10);
    postById.rows[0].created_at = newCreatedAt;

    // get all the comments belonging to the post
    const getCommentsForPost = await pool.query(
      'SELECT C.*, U.username, U.tag_name, U.user_avatar FROM comments AS C JOIN users AS U ON C.user_id = U.id WHERE C.post_id = $1 ORDER BY created_at DESC;', [postById.rows[0].id]
    );

    const getLikesOfPost = await pool.query(
      'SELECT id, post_like, user_id FROM likes WHERE post_like = $1;', [postById.rows[0].id]
    );
    
    // loop to get likes of each post
    if (getCommentsForPost.rows.length > 0) {
      const queryPromise = (query, ...values) => {
        return new Promise((resolve, reject) => {
          pool.query(query, values, (err, res) => {
            if (err) {
              reject(err);
            } else {
              resolve(res);
            }
          })
        });
      };

      for (let i = 0; i < getCommentsForPost.rows.length; i++) {
        const commentLikesQuery = 'SELECT id, comment_like, user_id FROM likes WHERE comment_like = $1;';

        const postCommentsLikes = await queryPromise(commentLikesQuery, getCommentsForPost.rows[i].id)

        let commentLikes = postCommentsLikes.rows;

        getCommentsForPost.rows[i] = {...getCommentsForPost.rows[i], commentLikes};
      }
    }

    res.json({
      success: "Success! Found post by id.",
      data: {
        postData: postById.rows[0],
        postLikes: getLikesOfPost.rows,
        postComments: getCommentsForPost.rows
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error...');
  }
}
// postman tested passed
exports.createPost = async (req, res, next) => {
  const { id } = req.user;
  // const { title, image_url, description } = req.body;
  let { title, description } = req.body;
  let imageUrl = '';
  let imageFilename = '';
  if (!title) {
    title = '';
  }

  try {
    if (!description) {
      return res.status(400).json({ errors: [{ msg: 'Description is required.' }] });
    }
    if (req.file && req.file.path) {
      imageUrl = req.file.path;
      imageFilename = req.file.filename;
    }
    if (imageUrl.startsWith('dist\\')) {
      let editImgUrl = imageUrl.slice(4);
      imageUrl = editImgUrl;
    }
    // get name, user, avatar associated w/post, get token from logged in user; get user data
    const userData = await pool.query(
      'SELECT id, username, tag_name, user_avatar FROM users WHERE users.id = $1;', [id]
    );

    if (!userData.rows.length > 0) {
      return res.status(403).json({ errors: [{ msg: "Cannot get user data." }] });
    }
    
    // using user data apply to post data
    let username = userData.rows[0].username;
    let tag_name = userData.rows[0].tag_name;
    let user_avatar = userData.rows[0].user_avatar;
    let postUserId = userData.rows[0].id;
    const userPost = await pool.query(
      'INSERT INTO posts (title, image_url, image_url_filename, description, user_id) VALUES ($1, $2, $3, $4, $5) RETURNING *;', [title, imageUrl, imageFilename, description, postUserId]
    );

    if (!userPost.rows.length > 0) {
      return res.status(403).json({ errors: [{ msg: "Failed to create post." }] });
    }
    // userData.rows[0].user_password = undefined;
    let created_at = userPost.rows[0].created_at;
    let newCreatedAt = created_at.toISOString().slice(0, 10);
    userPost.rows[0].created_at = newCreatedAt;
    let postUserData = {username, tag_name, user_avatar};
    let post = userPost.rows[0];
    let postLikes = {postLikes: []};
    let postComments = {postComments: []};
    let newPost = {...postUserData, ...post, ...postLikes, ...postComments};
    res.status(200).json({
      status: "Success! Post created!",
      data: {
        newPost
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error...');
  }
}

// postman tested and passed
exports.createPostComment = async (req, res, next) => {
  const { id } = req.user;
  const { post_id } = req.params; // req.body?
  // const { title, image_url, description } = req.body;
  let { title, description } = req.body;
  let imageUrl = '';
  let imageFilename = '';
  if (!title) {
    title = '';
  }

  try {
    if (!description) {
      return res.status(400).json({ errors: [{ msg: 'Description is required.' }] });
    }
    if (req.file && req.file.path) {
      imageUrl = req.file.path;
      imageFilename = req.file.filename;
    }
    if (imageUrl.startsWith('dist\\')) {
      let editImgUrl = imageUrl.slice(4);
      imageUrl = editImgUrl;
    }
    // first select user data, to build the comment
    const userData = await pool.query(
      'SELECT username, tag_name, user_avatar FROM users WHERE id = $1;', [id]
    );

    if(!userData.rows.length > 0) {
      return res.status(403).json({ errors: [{ msg: "No user data found." }] });
    }

    // userData.rows[0].user_password = undefined;
    const username = userData.rows[0].username;
    const tag_name = userData.rows[0].tag_name;
    const user_avatar = userData.rows[0].user_avatar;
    
    const postCommentQuery = await pool.query(
      'INSERT INTO comments (title, image_url, image_url_filename, description, post_id, user_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;', [title, imageUrl, imageFilename, description, post_id, id]
    );

    let commentUserData = {username, tag_name, user_avatar};
    let commentLikes = {commentLikes: []};
    let postComment = {...commentUserData, ...postCommentQuery.rows[0], ...commentLikes};
    res.json({
      success: "Success! Made a post comment!",
      data: {
        postComment
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error...");
  }
}

// postman tested and passed
exports.updatePostById = async (req, res, next) => {
  const { id } = req.user;
  // get post to update by its id
  const { post_id } = req.params;
  // const { title, image_url, description } = req.body;
  let { title, description } = req.body;
  // const { path, filename } = req.file;
  if (!title) {
    title = '';
  }
  let imageUrl = '';
  let imageFilename = '';
  let updatePost;
  try {
    if (!description) {
      return res.status(400).json({ errors: [{ msg: 'Description is required.' }] });
    }
    if (req.file && req.file.path) {
      imageUrl = req.file.path;
      imageFilename = req.file.filename;
    }
    if (imageUrl.startsWith('dist\\')) {
      let editImgUrl = imageUrl.slice(4);
      imageUrl = editImgUrl;
    }

    // to delete image from post then delete the entire post
    // updating post image, first get current image_url from db, pass value to cloud to delete
    const usersData = await pool.query(
      'SELECT username, tag_name, user_avatar FROM users WHERE id = $1;', [id]
    );

    if (!usersData.rows.length > 0) {
      return res.status(400).json({ errors: [{ msg: "Unable to retrieve users data." }] });
    }

    // attempting to update the post
    if (imageUrl !== '') {
      if (imageFilename !== '') {
        let currImageFilename = await pool.query(
          'SELECT image_url_filename FROM posts WHERE id = $1;', [post_id]
        );

        if (currImageFilename.rows[0].image_url_filename) {
          await cloudinary.uploader.destroy(currImageFilename.rows[0].image_url_filename);
        }
      }
      
      // delete current image from cloud before update to db
      updatePost = await pool.query(
        'UPDATE posts SET title = $1, image_url = $2, image_url_filename = $3, description = $4 WHERE id = $5 RETURNING *;', [title, imageUrl, imageFilename, description, post_id]
      );
    }
    if (imageUrl === '') {
      updatePost = await pool.query(
        'UPDATE posts SET title = $1, description = $2 WHERE id = $3 RETURNING *;', [title, description, post_id]
      );
    }

    if (!updatePost.rows.length > 0) {
      // return res.json({ msg: "Unable to update user post!"});
      return res.status(403).json({ errors: [{ msg: "Failed to update user post." }] });
    }

    let created_at = updatePost.rows[0].created_at;
    let newCreatedAt = created_at.toISOString().slice(0, 10);
    updatePost.rows[0].create_at = newCreatedAt;

    res.status(200).json({
      success: "Success! Updated user post!",
      data: {
        updatePost: {...usersData.rows[0], ...updatePost.rows[0]}
      }
    })
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error..."); 
  }
}

// postman tested and passed
exports.likePost = async (req, res, next) => {
  const { id } = req.user;
  const { post_id } = req.params; // req.body?
  try {
    // find post matching user id
    const checkIfLiked = await pool.query(
      'SELECT post_like, user_id FROM likes WHERE post_like = $1 AND user_id = $2;', [post_id, id]
    );
    if (checkIfLiked.rows.length > 0) {
      return res.status(400).json({ errors: [{ msg: "Post is already liked." }] });
    }
    // insert like into likes table (make relation)
    const likePost = await pool.query(
      'INSERT INTO likes (post_like, user_id) VALUES ($1, $2) RETURNING id, post_like, user_id;', [post_id, id]
    );

    if (!likePost.rows.length > 0) {
      return res.status(400).json({ errors: [{ msg: "Could not like post." }] });
    }
    // handle client-side search for post id and user id match to count the like as valid...
    let postLike = {...likePost.rows[0]};
    res.json({
      success: "Success! Post liked!",
      data: {
        postLike
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error...");
  }
}

// postman tested and passed
exports.unlikePost = async (req, res, next) => {
  const { id } = req.user;
  const { post_id } = req.params;
  try {
    // find post matching user id
    const checkIfLiked = await pool.query(
      'SELECT id, post_like, user_id FROM likes WHERE post_like = $1 AND user_id = $2;', [post_id, id]
    );
    if (!checkIfLiked.rows.length > 0) {
      return res.status(400).json({ errors: [{ msg: "Post is not liked yet." }] });
    }
    const unlikePost = await pool.query(
      'DELETE FROM likes WHERE post_like = $1 AND user_id = $2;', [post_id, id]
    );
    // handle in client-side search for post id and user id match to count the like as valid...
    res.status(200).json({
      sucess: "Success! Post has been unliked!",
      data: {
        userId: req.user.id
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error...");
  }
}

// postman tested and passed, for now this feature is not implemented...
exports.updatePostComment = async (req, res, next) => {
  const { id } = req.user;
  const { post_id, comment_id } = req.params;
  const { title, image_url, description } = req.body;
  const { path, filename } = req.file;
  let imageUrl = '';
  let imageFilename = '';
  try {
    if (path) {
      imageUrl = path;
      imageFilename = filename;
    }
    if (imageFilename !== '') {
      let currImageFilename = await pool.query(
        'SELECT image_url_filename FROM comments WHERE id = $1;', [comment_id]
      );
      
      if (currImageFilename.rows[0].image_url_filename) {
        await cloudinary.uploader.destroy(currImageFilename.rows[0].image_url_filename);
      }
    }
    // may need to first select user data (in case it has since changed), to place into updated post
    const usersData = await pool.query(
      'SELECT id, username, tag_name, user_avatar FROM users WHERE id = $1;', [id]
    );

    if (!usersData.rows.length > 0) {
      return res.status(403).json({ errors: [{ msg: "Unauthorized. No user data found." }] });
    }

    // usersData.rows[0].user_password = undefined;
    const username = usersData.rows[0].username;
    const tagname = usersData.rows[0].tag_name;
    const avatar = usersData.rows[0].user_avatar;

    const updatePostComment = await pool.query(
      'UPDATE comments SET comment_username = $1, comment_tag_name = $2, title = $3, avatar = $4, image_url = $5, image_url_filename = $6, description = $7 WHERE post_id = $8 AND id = $9 RETURNING *;', [username, tagname, title, avatar, imageUrl, imageFilename, description, post_id, comment_id]
    );

    if (!updatePostComment.rows.length > 0) {
      return res.status(400).json({ errors: [{ msg: "Failed to update comment." }] });
    }

    res.status(200).json({
      success: "Success! Post comment has been updated!",
      data: {
        updatedComment: updatePostComment.rows[0]
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error...");
  }
}

// postman tested and passed
exports.likeComment = async (req, res, next) => {
  const { id } = req.user;
  const { comment_id } = req.params;
  try {
    // find post matching user id
    const checkIfLiked = await pool.query(
      'SELECT comment_like, user_id FROM likes WHERE comment_like = $1 AND user_id = $2;', [comment_id, id]
    );

    if (checkIfLiked.rows.length > 0) {
      // return res.status(400).json("Comment is already been liked!")
      return res.status(400).json({ errors: [{ msg: "Comment is already liked!" }] });
    }

    const likeComment = await pool.query(
      'INSERT INTO likes (comment_like, user_id) VALUES ($1, $2) RETURNING *;', [comment_id, id]
    );

    if (!likeComment.rows.length > 0) {
      return res.json({ msg: "Error! Could not like comment!" });
    }

    res.json({
      success: "Success! Comment liked!",
      data: { likeComment: likeComment.rows[0] }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error...");
  }
}

// postman tested annd passed
exports.unlikeComment = async (req, res, next) => {
  const { id } = req.user;
  const { comment_id } = req.params;
  try {
    // find post matching user id
    const checkIfLiked = await pool.query(
      'SELECT comment_like, user_id FROM likes WHERE comment_like = $1 AND user_id = $2;', [comment_id, id]
    );
    if (!checkIfLiked.rows.length > 0) {
      // return res.status(400).json("Comment is not liked yet!");
      return res.status(400).json({ errors: [{ msg: "Comment is not liked yet!" }] });
    }
    // could do a select query on user id and compare to commment.user_id, if a match then unlike the comment...
    const unlikeComment = await pool.query(
      'DELETE FROM likes WHERE comment_like = $1 AND user_id = $2', [comment_id, id]
    );
    // console.log("Backend comment unliked");
    res.status(200).json({
      sucess: "Success! Comment has been unliked!",
      data: {
        userId: req.user.id
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error...");
  }
}

// postman tested and passed
exports.deletePostComment = async (req, res, next) => {
  const { id } = req.user;
  const { post_id, comment_id } = req.params;
  try {
    // check if the posts exists, otherwise return null
    const checkIfExists = await pool.query(
      'SELECT id, post_id, user_id FROM comments WHERE id = $1 AND post_id = $2 AND user_id = $3;', [comment_id, post_id, id]
    );
    // does not activate if user id does not match (preventing users from deleting each others domments) or if comment is already deleted.
    if (!checkIfExists.rows.length > 0) {
      return res.status(404).json({ errors: [{ msg: "Comment does not exist." }] });
    }

    let currImageFilename = await pool.query(
      'SELECT image_url_filename FROM comments WHERE id = $1 AND post_id = $2;', [comment_id, post_id]
    );

    if (currImageFilename.rows[0].image_url_filename) {
      await cloudinary.uploader.destroy(currImageFilename.rows[0].image_url_filename);
    }
    const deletePostComment = await pool.query(
      'DELETE FROM comments WHERE id = $1 AND post_id = $2 AND user_id = $3;', [comment_id, post_id, id]
    );

    res.json({ sucess: "Success! Comment is deleted." });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error...');
  }
}

// postman tested and passed
exports.deletePostById = async (req, res, next) => {
  const { id } = req.user;
  const { post_id } = req.params;
  try {
    // check if the posts exists, otherwise return null, also ensured that post belongs to the original user (that no one else can delete)
    const checkIfExists = await pool.query(
      'SELECT id, user_id FROM posts WHERE id = $1 AND user_id = $2;', [post_id, id]
    );
    // does not activate if user id does not match (preventing users from deleting each others domments) or if comment is already deleted. 

    if (!checkIfExists.rows.length > 0) {
      return res.status(404).json({ errors: [{ msg: "Post does not exist." }] });
    }

    let currImageFilename = await pool.query(
      'SELECT image_url_filename FROM posts WHERE id = $1;', [post_id]
    );

    if (currImageFilename.rows[0].image_url_filename) {
      await cloudinary.uploader.destroy(currImageFilename.rows[0].image_url_filename);
    }

    // delete all images for each comment of post
    const getCommentImagesForPost = await pool.query(
      'SELECT image_url_filename FROM comments WHERE post_id = $1;', [post_id]
    )

    if (getCommentImagesForPost.rows.length > 0) {
      let promises = [];
      for (let i = 0; i < getCommentImagesForPost.rows.length; i++) {
        // console.log("loading promise comment img to delete");
        if (getCommentImagesForPost.rows[i].image_url_filename !== '') {
          // console.log("promises array result...");
          promises.push(cloudinary.uploader.destroy(getCommentImagesForPost.rows[i].image_url_filename));
        }
      }
      await Promise.all(promises);
    };

    // must delete any comments belonging to a post first! Do not want comments to linger without a parent post!
    // perhaps let comments linger and replace post with "this post was removed by the user"
    // due to CASCADE comments belonging to post delete themselves along with the post
    // const deleteCommentsBelongingToPost = await pool.query(
    //   'DELETE FROM comments WHERE post_id = $1;', [post_id]
    // );
    const deletePostAndComments = await pool.query(
      'DELETE FROM posts WHERE id = $1 AND user_id = $2;', [post_id, id]
    );

    res.json({
      sucess: "Success! Post is deleted.",
      data: {
        message: "This post was deleted by the user."
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error...');
  }
}