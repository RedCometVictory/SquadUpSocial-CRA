import React, { Fragment, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { followProfile, unfollowProfile } from '../../../redux/actions/profileActions';

const ProfileAbout = ({
  isAuth, user,
  details: {
    id, company, status, interests, bio
  },
    followers,
    following
  }) => {

  let isCurrentlyFollowing;

  let followResult = followers?.filter(follow => follow.follower_id === user?.id);
  isCurrentlyFollowing = followResult?.length > 0;

  const [showFollow, setShowFollow] = useState(isCurrentlyFollowing);

  const { user_id } = useParams();
  const dispatch = useDispatch();
  
  const makeFollow = () => {
    dispatch(followProfile(user_id));
    setShowFollow(!isCurrentlyFollowing);
  }

  const makeUnfollow = () => {
    dispatch(unfollowProfile(user_id));
    setShowFollow(!isCurrentlyFollowing);
  }

  return (
    <Fragment>
      <div className="profile__follow-details">
        <div className="profile__followers-info">
          <div className="profile__follow-num"> 
            {!followers ? (
              <div className="profile__follow"><span className="profile__follow-number">No</span> followers</div>
            ) : (
              <div className="profile__follow"><span className="profile__follow-number">{followers.length}</span> followers</div>
            )}
            {!following ? (
              <div className="profile__follow"><span className="profile__follow-number">0</span> following</div>
            ) : (
              <div className="profile__follow"><span className="profile__follow-number">{following.length}</span> following</div>
            )}
          </div>
          <div className="profile__follow-stat">
            {(!isAuth && user === null) || user.id === user_id ? (
              <Fragment>
                <div></div>
              </Fragment>
            ) : showFollow ? (
              <button onClick={makeUnfollow} className="btn btn-primary btn-capsule">Unfollow</button>
            ) : (
              <button onClick={makeFollow} className="btn btn-primary btn-capsule">Follow</button>
            )}
          </div>
        </div>
      </div>
      <div className="profile__details">
        <div className="profile__detail">Company: {company}</div>
        <div className="profile__detail">Current Status: {status}</div>
        <p className="profile__detail">About Me: {bio}</p>
        <div className="profile__detail profile__interests">
          Interests: 
          {interests && interests.map((interest, index) => (
            <div key={index} className="profile__interest">
              <div className="profile__info-block">
                {interest}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Fragment>
  );
};
export default ProfileAbout;