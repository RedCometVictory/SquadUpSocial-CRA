import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
// import { updatePostComment, addPostCommentLike, removePostCommentLike, deletePostComment } from '../../../redux/actions/postActions';
import { addPostCommentLike, removePostCommentLike, deletePostComment } from '../../../redux/actions/postActions';
// comment: { _id, text, name, avatar, user, date }
// post: { id, avatar, post_username, post_tag_name, title, image_url, postLikes, postComments, description, user_id, created_at }
const CommentItem = ({ comment, postId, post, isAuth }) => {
  const { post_id } = useParams();
  const dispatch = useDispatch();
  // const isAuth = useSelector(state => state.auth);
  // const { isAuthenticated, user } = isAuth;
  return (
    <div className="comment__comment-wrapper">
      <div className="comment__comment">
        <div className="comment__comment-header">
          <Link to={`/profile/${comment.user_id}`}>
            <img className="comment__comment-avatar" src={comment.user_avatar} alt="user avatar" />
          </Link>
          <div className="comment__comment-name">
            <h3 className="comment__comment-username">{comment.username}</h3>
            <h5 className="comment__comment-tag-name">{comment.tag_name}</h5>
          </div>
        </div>
        <h4 className="comment__comment-title">{comment.title}</h4>
        <div className="comment__image-container">
          {comment.image_url && (
            <img className="comment__comment-image" src={comment.image_url} alt="comment content" />
          )}
        </div>
        <p className="comment__comment-description">{comment.description}</p>
        <div className="comment__comment-stats">
          <div className="comment__stat-sec-one">
            <button className="btn btn-secondary comment__thumb-btn"
            onClick={(e) => dispatch(addPostCommentLike(comment.id))} type="button" >
              <i className="fas fa-thumbs-up comment__thumb-up"></i>{" "}
              {comment.commentLikes.length > 0 && <span>{comment.commentLikes.length}</span>}
            </button>
            <button className="btn btn-secondary comment__thumb-btn"
            onClick={(e) => dispatch(removePostCommentLike(comment.id))} type="button" >
              <i className="fas fa-thumbs-down"></i>
            </button>
          </div>
            <div className="comment__stat-sec-two">
              {/* <Link to={`/post/edit-comment/${post_id}/${comment.id}`} className="btn btn-secondary">
                <CommentEditForm />
                <span>Edit Comment</span>
              </Link> */}
              {/* <button className="btn btn-secondary"
              onClick={(e) => dispatch(editPostComment(post_id, comment.id, formData, history))}
              type="button" >
                <i className=""></i> Edit Comment
              </button> */}
              {isAuth && isAuth.user.id === comment.user_id && (
                <button className="btn btn-danger comment__delete-comment"
                onClick={(e) => dispatch(deletePostComment(post_id, comment.id))}
                type="button" >
                  <i className="fas fa-times"></i>
                </button>
              )}
            </div>
        </div>
      </div>
    </div>      
  );
};
export default CommentItem;