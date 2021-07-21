/*
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams, useHistory } from 'react-router-dom';
import Spinner from '../../layouts/Spinner';
// import CommentItem from './CommentItem';
import { updatePostComment } from '../../../redux/actions/postActions';
// import { updatePostComment } from '../../../redux/actions/postActions';

const initialState = {title: '', description: ''};

const CommentEditForm = ({ postId }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { post_id, comment_id } = useParams();
  const postState = useSelector(state => state.post);
  const { post } = postState;
  const [formData, setFormData] = useState(initialState);

  
  useEffect(() => {
    dispatch(getCommentById(comment_id));
    setFormData({
      title: loading || !post ? '' : post.postData.title,
      // image_url: loading || !post ? '' : post.postData.image_url,
      description: loading || !post ? '' : post.postData.description
    })
  }, [dispatch, post_id, loading]);
  // const { title, image_url, description } = formData;
  const { title, description } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = e => {
    e.preventDefault();
    dispatch(updatePostComment(post_id, comment_id, formData, history));
    // clear form after submitting
    // setFormData({title: '', image_url: '', description: ''});
    setFormData({title: '', description: ''});
  }
*/
  // return (
    // <section className="post comments__comment-form">
      {/* <div className="post__post-wrapper"> */}
        {/* <div className="post__post"> */}
          {/* <div className="post__post-header"> */}
            {/* <Link to={`/profile/${comment.user_id}`}>
              <img className="post__post-avatar" src={comment.avatar} alt="user avatar" />
            </Link> */}
            {/* <div className="post__post-name"> */}
              {/* <h3 className="post__post-username">{comment.comment_username}</h3> */}
              {/* <h5 className="post__post-tag-name">{comment.comment_tag_name}</h5> */}
            {/* </div> */}
          {/* </div> */}
          {/* <h4 className="post__post-title">{comment.title}</h4> */}
          {/* <div className="post__image-container"> */}
            {/* {post.image_url && ( */}
              {/* <img className="post__post-image" src={post.image_url} /> */}
            {/* )} */}
          {/* </div> */}
          {/* <p className="post__post-description">{comment.description}</p> */}
          {/* <div className="post__post-stats"> */}
            {/* <div className="post__stat-sec-one"> */}
              {/* <button className="btn btn-secondary post__thumb-btn" */}
              {/* // onClick={(e) => dispatch(addPostCommentLike(comment.id))} type="button" > */}
                {/* <i className="fas fa-thumbs-up post__thumb-up"></i>{" "} */}
                {/* {comment.commentLikes.length > 0 && <span>{comment.commentLikes.length}</span>} */}
              {/* </button> */}
              {/* <button className="btn btn-secondary post__thumb-btn" */}
              {/* onClick={(e) => dispatch(removePostCommentLike(comment.id))} type="button" > */}
                {/* <i className="fas fa-thumbs-down"></i> */}
              {/* </button> */}
            {/* </div> */}
            {/* {user s&& user.id === post.user_id && ( */}
              {/* <div className="post__stat-sec-two"> */}
                {/* <Link to={`/post/comment/${post_id}/${comment.id}`} className="btn btn-secondary"> */}
                  {/* <CommentEditForm /> */}
                  {/* <span>Edit Comment</span> */}
                {/* </Link> */}
                {/* <button className="btn btn-secondary"
                onClick={(e) => dispatch(editPostComment(post_id, comment.id, formData, history))}
                type="button" >
                  <i className=""></i> Edit Comment
                </button> */}
                {/* <button className="btn btn-danger" */}
                {/* // onClick={(e) => dispatch(deletePostComment(post_id))} */}
                {/* // type="button" > */}
                  {/* <i className="fas fa-times"></i> */}
                {/* </button> */}
              {/* </div> */}
            {/* )} */}
          {/* </div> */}
          {/* )} */}
        {/* </div> */}
      {/* </div>       */}


  
    {/* edit post */}
      {/* <div className="post__form-section">
        <form className="form post__form" onSubmit={onSubmit} >
          <h3>Leave a Comment</h3>
          <input
            type="text"
            placeholder="Comment Title (Optional)"
            className="post__form-title"
            name="title"
            onChange={e => onChange(e)}
            value={title}
          />
          <textarea
            name="description"
            cols="30"
            rows="5"
            placeholder="Create a comment"
            onChange={e => onChange(e)}
            value={description}
            required
          ></textarea>
          <input type="submit" className="btn btn-primary post__form-btn" value="Create Comment" />
        </form>
      </div> */}


    {/* </section> */}
  {/* ); */}
{/* } */}
{/* export default CommentEditForm; */}





// ************************************************************
// ************************************************************
// ************************************************************
















// import React, { useState, useEffect } from 'react';
// import { useHistory, useParams } from 'react-router-dom';
// import Spinner from '../../layouts/Spinner';
// import { useDispatch, useSelector } from 'react-redux';
// import { getPostById, updatePostById } from '../../../redux/actions/postActions';

// const initialState = {title: '', image_url: '', description: ''};

// const PostEditForm = () => {
//   const { post_id } = useParams();
//   const dispatch = useDispatch();
//   const history = useHistory();
//   const postState = useSelector(state => state.post);
//   const { post, loading } = postState;
//   const [formData, setFormData] = useState(initialState);

//   useEffect(() => {
//     dispatch(getPostById(post_id));
//     setFormData({
//       title: loading || !post ? '' : post.postData.title,
//       image_url: loading || !post ? '' : post.postData.image_url,
//       description: loading || !post ? '' : post.postData.description
//     })
//   }, [dispatch, post_id, loading]);

//   const { title, image_url, description } = formData;
//   const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

//   const onSubmit = e => {
//     e.preventDefault();
//     dispatch(updatePostById(post_id, formData, history));
//     // setFormData({title: '', image_url: '', description: ''});
//   }
//   return (
//     loading && !post ? (
//       <Spinner /> 
//     ) : post === null ? (
//       <div>nothing found</div>
//     ) : (
//       <div className="post post__form-section">
//         <form className="form post__form" onSubmit={onSubmit} >
//           <h3>Edit Post</h3>
//           <input
//             type="text"
//             placeholder="Post Title (Optional)"
//             className="post__form-title"
//             name="title"
//             onChange={e => onChange(e)}
//             value={title}
//           />
//           <input
//             type="text"
//             placeholder="Image URL Example: https://imgur.com/example.png"
//             className="post__form-title"
//             name="image_url"
//             onChange={e => onChange(e)}
//             value={image_url}
//           />
//           <textarea
//             name="description"
//             cols="30"
//             rows="5"
//             placeholder="Create a post"
//             onChange={e => onChange(e)}
//             value={description}
//             required
//           ></textarea>
//           <input type="submit" className="btn btn-primary post__form-btn" value="Submit Post Edit" />
//         </form>
//       </div>
//     )
//   );
// };
// export default PostEditForm;


// {/* <input
//   type="text"
//   placeholder="Image URL Example: https://imgur.com/example.png"
//   className="post__form-title"
//   name="image_url"
//   onChange={e => onChange(e)}
//   value={image_url}
// /> */}




// // comment: { _id, text, name, avatar, user, date }
// // post: { id, avatar, post_username, post_tag_name, title, image_url, postLikes, postComments, description, user_id, created_at }
// const CommentItem = ({ comment, postId, post, isAuth }) => {
//   const { post_id } = useParams();
//   const dispatch = useDispatch();
//   // const isAuth = useSelector(state => state.auth);
//   // const { isAuthenticated, user } = isAuth;
//   // console.log("comment prop")
//   // console.dir(comment)
//   return (
    // <section>
    //   <div className="post__post-wrapper">
    //     <div className="post__post">
    //       <div className="post__post-header">
    //         <Link to={`/profile/${comment.user_id}`}>
    //           <img className="post__post-avatar" src={comment.avatar} alt="user avatar" />
    //         </Link>
    //         <div className="post__post-name">
    //           <h3 className="post__post-username">{comment.comment_username}</h3>
    //           <h5 className="post__post-tag-name">{comment.comment_tag_name}</h5>
    //         </div>
    //       </div>
    //       <h4 className="post__post-title">{comment.title}</h4>
    //       <div className="post__image-container">
    //         {/* {post.image_url && ( */}
    //           {/* <img className="post__post-image" src={post.image_url} /> */}
    //         {/* )} */}
    //       </div>
    //       <p className="post__post-description">{comment.description}</p>
    //       <div className="post__post-stats">
    //         <div className="post__stat-sec-one">
    //           <button className="btn btn-secondary post__thumb-btn"
    //           onClick={(e) => dispatch(addPostCommentLike(comment.id))} type="button" >
    //             <i className="fas fa-thumbs-up post__thumb-up"></i>{" "}
    //             {comment.commentLikes.length > 0 && <span>{comment.commentLikes.length}</span>}
    //           </button>
    //           <button className="btn btn-secondary post__thumb-btn"
    //           onClick={(e) => dispatch(removePostCommentLike(comment.id))} type="button" >
    //             <i className="fas fa-thumbs-down"></i>
    //           </button>
    //         </div>
    //         {/* {user s&& user.id === post.user_id && ( */}
    //           <div className="post__stat-sec-two">
    //             <Link to={`/post/comment/${post_id}/${comment.id}`} className="btn btn-secondary">
    //               {/* <CommentEditForm /> */}
    //               <span>Edit Comment</span>
    //             </Link>
    //             {/* <button className="btn btn-secondary"
    //             onClick={(e) => dispatch(editPostComment(post_id, comment.id, formData, history))}
    //             type="button" >
    //               <i className=""></i> Edit Comment
    //             </button> */}
    //             <button className="btn btn-danger"
    //             onClick={(e) => dispatch(deletePostComment(post_id))}
    //             type="button" >
    //               <i className="fas fa-times"></i>
    //             </button>
    //           </div>
    //         {/* )} */}
    //       </div>
    //       {/* )} */}
    //     </div>
    //   </div>      
    // </section>
//   );
// };
// export default CommentItem;