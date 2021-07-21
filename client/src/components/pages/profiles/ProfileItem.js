import React from 'react';
import { Link } from 'react-router-dom';

const ProfileItem = ({
  profile: { id, username, tag_name, user_avatar }
}) => {
  return (
    <div className="profiles__profile">
      <img className="profiles__profile-img" src={user_avatar} alt="user avatar"/>
      <div className="profiles__profile-info">
        <h2>{username}</h2>
        <small className="profiles__profile-tag-name">{tag_name}</small>
        <Link className="btn btn-primary profiles__profile-btn" to={`/profile/${id}`}>View Profile</Link>
      </div>
    </div>
  );
};
export default ProfileItem;