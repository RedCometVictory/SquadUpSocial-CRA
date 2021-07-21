import React, { Fragment, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { deleteProfile } from '../../redux/actions/profileActions';

const DashboardActions = ({ user: {id}, followers, followings }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [followButton, toggleFollowButton] = useState(true);
  const [popup, setPopup] = useState(false);

  const handleDelete = () => {
    setPopup(true);
  }

  const deleteTrue = () => {
    setPopup(false);
    dispatch(deleteProfile(history));
  }
  const deleteFalse = () => {
    setPopup(false);
  }
  return (
    <Fragment>
      {popup && (
        <div className="dashboard__delete-wrapper">
          <h2>Are you Sure?</h2>
          <p>You are attempting to delete your profile and account. This action CANNOT be undone!</p>
          <div className="dashboard__btn-sec">
            <button className="btn btn-secondary dashboard__btn-one" onClick={() => deleteFalse()}>Do Not Delete</button>
            <button className="btn btn-primary dashboard__btn-two" onClick={() => deleteTrue()}>Delete My Account</button>
          </div>
        </div>
      )}
      <div className="dashboard__buttons">
        <Link to="/edit-profile" className="btn btn-secondary dashboard__button">
          <i className="fas fa-user-circle text-primary"></i> Edit Profile
        </Link>
        <Link to={`/profile/${id}`} className="btn btn-primary dashboard__button">
          My Profile
        </Link>
        {followButton ? (
          <button className="btn btn-secondary dashboard__button" onClick={(e) => toggleFollowButton(!followButton)} type="button">
            <i className="fas fa-user-friends text-primary"></i> Show Following
          </button>
        ) : (
          <button className="btn btn-secondary dashboard__button" onClick={(e) => toggleFollowButton(!followButton)} type="button">
            <i className="fas fa-user-friends text-primary"></i> Show Followers
          </button>
        )}
        <button className="btn btn-secondary dashboard__button" onClick={() => handleDelete()}>
          <i className="fas fa-user-friends text-primary"></i> Delete Profile & Account
        </button>
      </div>
      {followButton ? (
        <h2 className="dash-header">Your Followers</h2>
      ) : (
        <h2 className="dash-header">People You Are Following</h2>
      )}
      <section className="profiles-page-wrapper dash-follows">
        <div className="profiles dash-profiles">
          {followButton ? (
            <Fragment>
            {followers && followers.length > 0 ? (
              followers.map((follower, i) => (
                <div className="profiles__profile" key={i} >
                  <img className="profiles__profile-img" src={follower.user_avatar} alt="user avatar"/>
                  <div className="profiles__profile-info">
                    <h2>{follower.username}</h2>
                    <small className="profiles__profile-tag-name">{follower.tag_name}</small>
                    <Link className="btn btn-primary profiles__profile-btn" to={`/profile/${follower.id}`}>View Profile</Link>
                  </div>
                </div>      
              ))
            ) : (
              <h4>You have no followers...</h4>
            )}
            </Fragment>
          ) : (
            <Fragment>
            {followings && followings.length > 0 ? (
              followings.map((following, i) => (
                <div className="profiles__profile dash-follow" key={i} >
                  <img className="profiles__profile-img" src={following.user_avatar} alt="user avatar"/>
                  <div className="profiles__profile-info">
                    <h2>{following.username}</h2>
                    <small className="profiles__profile-tag-name">{following.tag_name}</small>
                    <Link className="btn btn-primary profiles__profile-btn" to={`/profile/${following.id}`}>View Profile</Link>
                  </div>
                </div>      
              ))
            ) : (
              <h4>You are currently following no one...</h4>
            )}
            </Fragment>
          )}            
        </div>
      </section>          
    </Fragment>
  );
};
export default DashboardActions;