import React, { Fragment, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Spinner from '../../layouts/Spinner';
import ProfileAbout from './ProfileAbout';
import ProfileSocials from './ProfileSocials';
import ProfilePost from './ProfilePost';
import { getProfileById } from '../../../redux/actions/profileActions';
const Profile = () => {
  const { user_id } = useParams();
  const dispatch = useDispatch();
  const userAuth = useSelector(state => state.auth);
  const profileData = useSelector(state => state.profile);
  const { isAuthenticated, user, loading } = userAuth;
  const { profileUserData, profileStats, profilePosts } = profileData;

  useEffect(() => {
    dispatch(getProfileById(user_id));
  }, [dispatch, user_id]);

  return (
    <Fragment>
      {loading ? (
        <Spinner />
      ) : profileData === null ? (
        <div className="profile-page-wrapper profile">
          <p>No profile information found.</p>
        </div>
      ) : (
        <div className="profile-page-wrapper profile">
          <div className="profile__header-image">
            {profileStats === null ? (
              <img className="profile__profile-bg-image" src="" alt="profile content"/>
            ) : !profileStats.profileDetails ?(
              <img src="" alt="profile content"/>
            ) : (
              <img className="profile__profile-bg-image" src={profileStats.profileDetails.background_image} alt="profile content"/>
            )}
          </div>
          <div className="profile__content-header">
            {profileUserData === null ? (
              <div>No user data found.</div>
            ) : (
              <Fragment>
                <div className="profile__avatar-position">
                  <img className="profile__profile-img" src={profileUserData.user_avatar} alt="user avatar" />
                </div>
                <div className="profile__header">
                  <h2>{profileUserData.username}</h2>
                  <h5 className="profile__profile-tag-name">{profileUserData.tag_name}</h5>
                </div>
              </Fragment>
            )}
            <div className="profile__header-buttons">
              <Link to="/profiles" className="profile__header-button btn btn-secondary">Back to Profiles</Link>
              { isAuthenticated && loading === false && user.id === user_id && profileStats && profileStats.profileDetails && (
                <Link to="/edit-profile" className="profile__header-button btn btn-secondary">Edit Your Profile</Link>
              )}
            </div>
          </div>
            {profileStats === null ? ( 
              <div className="profile__content">
                <div className="profile__follow-details">No profile information found.</div>
              </div>
            ) : profileStats.profileSocials && profileStats.profileDetails ? (
              <Fragment>
                <div className="profile__content">
                  <ProfileAbout isAuth={isAuthenticated} user={user} details={profileStats.profileDetails} followers={profileStats.followers} following={profileStats.following} followersCount={profileStats.followersCount} followingCount={profileStats.followingCount} />
                </div>
                <ProfileSocials socials={profileStats.profileSocials} />
              </Fragment>
            ) : (
              <Fragment>
                <div>User has not provided further profile details.</div>
              </Fragment>
            )}
            <h3 className="profile__posts-header">Profile Posts</h3>
            <div className="profile__exp">
              {profilePosts && profilePosts.length > 0 ? (
                <Fragment>
                  {profilePosts.map(post => (
                    <ProfilePost key={post.id} post={post} userData={profileUserData} />
                  ))}
                </Fragment>
              ) : (
                <Fragment>
                  <h4>User has made no posts.</h4>
                </Fragment>
              )}
          </div>
        </div>
      )}
    </Fragment>
  );
};
export default Profile;