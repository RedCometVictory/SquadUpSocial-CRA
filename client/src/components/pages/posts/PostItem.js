import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addPostsFeedLike, removePostsFeedLike, deleteFeedPost } from '../../../redux/actions/postActions';

const PostItem = ({ post }) => {
  const dispatch = useDispatch();
  const isAuth = useSelector(state => state.auth);
  // const { isAuthenticated, user } = isAuth;
  const { user } = isAuth;
  
  return (
    <div className="post__post-wrapper">
      <div className="post__post">
        <div className="post__post-header">
          <Link to={`/profile/${post.user_id}`}>
            <img className="post__post-avatar" src={post.user_avatar} alt="user avatar" />
          </Link>
          <div className="post__post-name">
            <h3 className="post__post-username">{post.username}</h3>
            <h5 className="post__post-tag-name">{post.tag_name}</h5>
          </div>
        </div>
        <h4 className="post__post-title">{post.title}</h4>
        <div className="post__image-container">
          {post.image_url && (
            <img className="post__post-image" src={post.image_url} alt="post content" />
          )}
        </div>
        <p className="post__post-description">{post.description}</p>
        {post && (
          <div className="post__post-stats">
            <div className="post__stat-sec-one">
              <div className="like-unlike-sec">
                <button className="btn btn-secondary post__feed-thumb-btn"
                onClick={(e) => dispatch(addPostsFeedLike(post.id))} type="button" >
                  <div className="post__like-num">
                    <i className="fas fa-thumbs-up post__thumb-up"></i>
                    <span>{post.postLikes.length > 0 && <span className="like-number">{post.postLikes.length}</span>}</span>
                  </div>
                </button>
                <button className="btn btn-secondary post__feed-thumb-btn post__thumb-down"
                onClick={(e) => dispatch(removePostsFeedLike(post.id))} type="button" >
                  <i className="fas fa-thumbs-down"></i>
                </button>
              </div>
              <Link to={`/post/${post.id}`} className="btn btn-secondary post__comment-btn">
                <span className="post__comment">
                  View Post /
                  <span className="post__comment-count">{post.postComments.length}</span> Comments
                </span>
              </Link>
            </div>
            {user && user.id === post.user_id && (
              <div className="post__stat-sec-two">
                <button className="btn btn-danger no-margin"
                onClick={(e) => dispatch(deleteFeedPost(post.id))}
                type="button" >
                  <i className="fas fa-times"></i>
                </button>
              </div>
            )}
          </div>
        )}
        <p className="post__date">{post.created_at}</p>
      </div>
    </div>      
  );
};
export default PostItem;