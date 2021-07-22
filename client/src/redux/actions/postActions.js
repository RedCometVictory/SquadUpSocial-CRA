import api from '../../utils/api';
import { setAlert } from './alertActions';
import {
  GET_ALL_POSTS,
  GET_POST_BY_ID,
  CREATE_POST,
  UPDATE_POST,  
  // LOADING_LIKES,
  CLEAR_POST,
  LIKE_POST,
  LIKE_FEED_POST,
  UNLIKE_POST,
  UNLIKE_FEED_POST,
  LIKE_COMMENT,
  UNLIKE_COMMENT,
  CREATE_COMMENT,
  UPDATE_COMMENT,
  DELETE_FEED_POST,
  DELETE_POST,
  DELETE_COMMENT,
  POST_ERROR,
  LIKE_ERROR,
  COMMENT_ERROR
} from '../constants/postConstants';
import { addPostForm, editPostForm, addCommentForm } from '../../utils/formDataServices';

// const baseURL = 'http://localhost:5000/api';
// const baseURL = `${process.env.HEROKU_DOMAIN}/api`;
// const baseURL = `https://squadupsocial.herokuapp.com/api`;
// const baseURL = '/api';
// const baseURL = '/';
// const config = {
//   headers: {
//     'Content-Type': 'multipart/form-data'
//   }
// }

// get posts - main feed
export const getAllPosts = () => async dispatch => {
  dispatch ({ type: CLEAR_POST });
  try {
    const res = await api.get('/posts');
    // const res = await axios.get(baseURL + '/posts');
    dispatch ({
      type: GET_ALL_POSTS,
      payload: res.data.data.posts
    });
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Get Post by id
export const getPostById = (postId) => async dispatch => {
  try {
    const res = await api.get(`/posts/${postId}`);

    dispatch ({
      type: GET_POST_BY_ID,
      payload: res.data.data // send post byid and post likes
    });
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};
// Add (create) Post
export const createPost = (formPostData) => async dispatch => {
  try {
    let servicedData = await addPostForm(formPostData);
    // send data w/headers config
    const res = await api.post("/posts", servicedData); 
    dispatch ({
      type: CREATE_POST,
      payload: res.data.data.newPost
    });
    dispatch(setAlert('Post created.', 'success'));
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
    dispatch(setAlert('Could not create post.', 'danger'));
  }
};

// Add Comment to Post - takes post id and respective form data of post.
export const createComment = (postId, formCommentData) => async dispatch => {
  try {
    let servicedData = await addCommentForm(formCommentData);

    // let servicedData = await addCommentForm(formData);
    // send from data of comment & post id it belongs to
    const res = await api.post(`/posts/comment/${postId}`, servicedData);
  
    // when adding comment, return comments as arr
    dispatch ({
      type: CREATE_COMMENT,
      payload: res.data.data.postComment
    });
    dispatch(setAlert("Comment created.", "success"));
  } catch (err) {
    dispatch({
      type: COMMENT_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
    dispatch(setAlert('Could not create comment.', 'danger'));
  }
};
  
// ==================================================
// post update
export const updatePostById = (postId, formPostData, history) => async dispatch => {
  try {
    let servicedData = await editPostForm(formPostData);

    const res = await api.put(`/posts/${postId}`, servicedData);
    dispatch ({
      type: UPDATE_POST,
      // may have to change to match getting post by id setup....
      payload: res.data.data.updatePost
    });
    dispatch(setAlert("Post updated.", "success"));
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
    dispatch(setAlert('Failed to update post.', 'danger'));
  }
};

export const updatePostComment = (postId, commentId, formData, history) => async dispatch => {
  try {
    const res = await api.put(`/posts/comment/${postId}/${commentId}`, formData);
  
    dispatch ({
      type: UPDATE_COMMENT,
      // send both data & id of post, particularly the likes data array id what is returned
      payload: { postId, commentId, updatedPostComment: res.data.data.updatedComment }
    });
    dispatch(setAlert('Comment updated.', 'success'));
    history.push(`/post/${postId}`);
  } catch (err) {
    dispatch({
      type: COMMENT_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
    dispatch(setAlert('Failed to update comment.', 'danger'));
  }
};
// ==================================================
// add like to post
export const addPostLike = (postId) => async dispatch => {
  try {
    const res = await api.put(`/posts/like/${postId}`);
    dispatch ({
      type: LIKE_POST,
      payload: res.data.data.postLike
    });
    dispatch(setAlert('Post liked.', 'success'));
  } catch (err) {
    dispatch({
      type: LIKE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
    dispatch(setAlert('Could not like post.', 'danger'));
  }
};

// add like to post in feed
export const addPostsFeedLike = (postId) => async dispatch => {
  try {
    const res = await api.put(`/posts/like/${postId}`);
    dispatch ({
      type: LIKE_FEED_POST,
      payload: {postLike: {...res.data.data.postLike}, postId}
    });
    dispatch(setAlert('Post liked.', 'success'));
  } catch (err) {
    dispatch({
      type: LIKE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
    dispatch(setAlert('Could not like post.', 'danger'));
  }
};

// remove like from post in feed
export const removePostsFeedLike = (postId) => async dispatch => {
  try {
    const res = await api.delete(`/posts/unlike/${postId}`);
    dispatch ({
      type: UNLIKE_FEED_POST,
      payload: {userId: res.data.data.userId, postId}
    });
    dispatch(setAlert('Post unliked.', 'success'));
  } catch (err) {
    dispatch({
      type: LIKE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
    dispatch(setAlert('Could not unlike post.', 'danger'));
  }
};

// remove like to posts
export const removePostLike = (postId) => async dispatch => {
  try {
    const res = await api.delete(`/posts/unlike/${postId}`);
    dispatch ({
      type: UNLIKE_POST,
      payload: {userId: res.data.data.userId, postId}
    });
    dispatch(setAlert('Post unliked.', 'success'));
  } catch (err) {
    dispatch({
      type: LIKE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
    dispatch(setAlert('Could not unlike post.', 'danger'));
  }
};

export const addPostCommentLike = (commentId) => async dispatch => {
  try {
    const res = await api.put(`/posts/comment/like/${commentId}`);
    dispatch ({
      type: LIKE_COMMENT,
      payload: { likeComment: res.data.data.likeComment, commentId }
    });
    dispatch(setAlert('Comment liked.', 'success'));
  } catch (err) {
    dispatch({
      type: LIKE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
    dispatch(setAlert('Could not like comment.', 'danger'));
  }
};

export const removePostCommentLike = (commentId) => async dispatch => {
  try {
    const res = await api.delete(`/posts/comment/unlike/${commentId}`);
    dispatch ({
      type: UNLIKE_COMMENT,
      payload: {userId: res.data.data.userId, commentId}
    });
    dispatch(setAlert('Comment unliked.', 'success'));
  } catch (err) {
    dispatch({
      type: LIKE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
    dispatch(setAlert('Could not unlike comment.', 'danger'));
  }
};

// Delete Post - filter via id, remove post from UI & db
export const deleteFeedPost = (postId) => async dispatch => {
  try {
    await api.delete(`/posts/delete/${postId}`);
    dispatch({ type: CLEAR_POST });
    dispatch ({
      type: DELETE_FEED_POST,
      payload: postId // send id of post
    });
    dispatch(setAlert('Post deleted.', 'success'));
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
    dispatch(setAlert('Failed to delete post.', 'danger'));
  }
};

// Delete Post - filter via id, remove post from UI & db
export const deletePost = (postId, history) => async dispatch => {
  try {
    await api.delete(`/posts/delete/${postId}`);
    dispatch({ type: CLEAR_POST });
    dispatch ({
      type: DELETE_POST //,
      // payload: postId // send id of post
    });
    dispatch(setAlert('Post deleted.', 'success'));
    history.push('/feed');
    // history.push('/dashboard');
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
    dispatch(setAlert('Failed to delete post.', 'danger'));
  }
};

// delete comment for posts / circle
export const deletePostComment = (postId, commentId) => async dispatch => {
  try {
    await api.delete(`/posts/delete/comment/${postId}/${commentId}`);
  
    dispatch ({
      type: DELETE_COMMENT,
      // send both data & id of post, particularly the likes data array id what is returned
      payload: { postId, commentId }
    });
    dispatch(setAlert('Comment removed.', 'success'));
  } catch (err) {
    dispatch({
      type: COMMENT_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
    dispatch(setAlert('Comment created.', 'danger'));
  }
};