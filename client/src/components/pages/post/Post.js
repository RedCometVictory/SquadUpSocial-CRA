import React, { Fragment, useEffect, useState } from 'react';
import { Link, useParams, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Spinner from '../../layouts/Spinner';
import CommentForm from './CommentForm';
import CommentItem from './CommentItem';
import PostEditForm from './PostEditForm';
import { getPostById, addPostLike, removePostLike, deletePost } from '../../../redux/actions/postActions';

const Post = () => {
  const { post_id } = useParams();
  const history = useHistory();
  const dispatch = useDispatch();
  const isAuth = useSelector(state => state.auth);
  const postState = useSelector(state => state.post);

  // const { isAuthenticated, user } = isAuth;
  const { user } = isAuth;
  const { post, loading } = postState;
  const [displayEditForm, toggleEditForm] = useState(false);
  useEffect(() => {
    dispatch(getPostById(post_id));
  }, [dispatch, post_id])
  return (
    <section>
      {loading || post === null ? (
        <Spinner />
      ) : post && post.postData ? (
        <Fragment>
        <div className="post__post-wrapper post-indiv">
          <div className="post__post">
            <div className="post__post-header">
              <Link to={`/profile/${post.postData.user_id}`}>
                <img className="post__post-avatar" src={post.postData.user_avatar} alt="user avatar" />
              </Link>
              <div className="post__post-name">
                <h3 className="post__post-username">{post.postData.username}</h3>
                <h5 className="post__post-tag-name">{post.postData.tag_name}</h5>
              </div>
            </div>
            {post.postData.title && (<h4 className="post__post-title">{post.postData.title}</h4>)}
            <div className="post__image-container">
              {post.postData.image_url && (
                <img className="post__post-image" src={post.postData.image_url}  alt="post content" />
              )}
            </div>
            <p className="post__post-description">{post.postData.description}</p>
            {isAuth && (
              <div className="post__post-stats post__indiv-view">
                <div className="post__stat-sec-one post__indiv-sec-one">
                  <button className="btn btn-secondary post__thumb-btn post__indiv-thumb"
                  onClick={(e) => dispatch(addPostLike(post.postData.id))} type="button" >
                    <i className="fas fa-thumbs-up post__thumb-up"></i>
                      <span>{post.postLikes.length > 0 && <span>{post.postLikes.length}</span>}</span>
                  </button>
                  <button className="btn btn-secondary post__thumb-btn post__indiv-thumb"
                  onClick={(e) => dispatch(removePostLike(post.postData.id))} type="button" >
                    <i className="fas fa-thumbs-down"></i>
                  </button>
                </div>
                {user && user.id === post.postData.user_id && (
                  <div className="post__stat-sec-two post__indiv-sec-two">
                    {displayEditForm ? (
                      <button className="btn btn-secondary post__post-edit"
                      onClick={(e) => toggleEditForm(!displayEditForm)}
                      type="button" >
                        <i className=""></i> Comment
                      </button>
                    ) : (
                      <button className="btn btn-secondary post__edit-btn"
                      onClick={(e) => toggleEditForm(!displayEditForm)}
                      type="button" >
                        <i className=""></i> Edit Post
                      </button>
                    )}
                    <button className="btn btn-danger post__delete-post"
                    onClick={(e) => dispatch(deletePost(post.postData.id, history))}
                    type="button" >
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                )}
              </div>
            )}
            <p className="post__date">{post.postData.created_at}</p>
          </div>
        </div>
        <div className="comments comments-wrapper">
          {displayEditForm ? (
            <div className="editform">
              <PostEditForm />
            </div>
          ) : (
            <div className="comment">
              <CommentForm postId={post.postData.id} />
            </div>
          )}
          <div className="comment__feed">
            <div className="comment__count">Total Comments:{" "}{post.postComments.length}</div>
            {post && post.postComments.map((comment, i) => <CommentItem comment={comment} key={i} postId={post_id} isAuth={isAuth} />)}
          </div>
        </div>
        </Fragment>
      ) : (
        <div className="post__post-wrapper">
          <p>No post found. Possibly deleted by the original poster or server error has occurred.</p>
        </div>
      )}
    </section>
  );
};
export default Post;