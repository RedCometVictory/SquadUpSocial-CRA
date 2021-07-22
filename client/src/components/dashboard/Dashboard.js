import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
// import Spinner from '../layouts/Spinner';
import DashboardActions from './DashboardActions';
// import { getCurrentUserAccountSettings, deleteProfile } from '../../redux/actions/profileActions';
import { getCurrentUserAccountSettings } from '../../redux/actions/profileActions'
// import { getCurrentProfile, deleteAccount } from '../../actions/profile';
const Dashboard = () => {
  const dispatch = useDispatch();
  const userAuth = useSelector(state => state.auth);
  const profile = useSelector(state => state.profile);
  const { isAuthenticated, user } = userAuth;
  // PROFILE_ERROR results if no profile yet exists
  // GET_PROFILE results if profile exists
  const { profileUserData, profileStats, loading } = profile;

  useEffect(() => {
    dispatch(getCurrentUserAccountSettings());
  }, [dispatch]);
  // deleting an account means not longer having access to it thus the protectedRoutes component will redirect us to the login page. Thus the account in both the user and profile collections hsould be erased. Deleting the account may not delete the posts as well, however not to worry as the way it is structured the avatar, name, etc stored inside of the posts. Its not referring to the user and likely will not break upon the user account being erased - the posts will not be accessible. But to be sure, erase the posts via the backend API.

  return (
    <section className="dashboard-page-wrapper">
      <h1>Dashboard</h1>
      <h2>
        <i className="fas fa-user" /> Welcome, { user && user.username }
      </h2>
      {/* {profileUserData !== null ? ( */}
      {/* {loading && profileUserData === null ? ( */}
        {/* <Spinner /> */}
      {/* ) :  */}
      {profileUserData !== null ? (
        <div className="dashboard">
          {!loading && isAuthenticated && user && (
            <DashboardActions user={user} followers={profileStats.followers} followings={profileStats.following} />
          )}
          </div>
      ) : (
        <div className="dashboard">
          <div className="dashboard__content-default">
            <div>
              <p>You have not setup a profile. Create one here.</p>
            </div>
            <Link to="/create-profile" className="btn btn-primary dashboard__btn">Create My Profile</Link>
          </div>
        </div>
      )}
    </section>
  );
};
export default Dashboard;