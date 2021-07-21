import React from 'react';
import { Link } from 'react-router-dom';

const ProfilePost = ({ post, userData }) => {
  return (
    post && (
      <div className="post__post-wrapper">
        <div className="post__post">
          <div className="post__post-header">
            <img className="post__post-avatar" src={userData.user_avatar} alt="user avatar" />
            <div className="post__post-name">
              <h3 className="post__post-username">{userData.username}</h3>
              <h5 className="post__post-tag-name">{userData.tag_name}</h5>
            </div>
          </div>
          <h4 className="post__post-title">{post.title}</h4>
          <div className="post__image-container">{post.image_url && (
            <img className="post__post-image" src={post.image_url} alt="post content"/>
          )}
          </div>
          <p className="post__post-description">{post.description}</p>
          <div className="post__post-stats">
            <div className="post__stat-sec">
              <button className="btn btn-secondary post__thumb-btn"
              type="button" >
                <i className="fas fa-thumbs-up post__thumb-up"></i>
                {post.postlikes && (
                  <span>{post.postlikes}</span>
                )}
              </button>
              <Link to={`/post/${post.id}`} className="btn btn-secondary post__thumb-btn post__thumb-btn--sec">
                <span className="post__comment">
                  View Post /
                  <span className="post__comment-count">{post.postcomments}</span> Comments
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  );
};
export default ProfilePost;