import React, { Fragment, useEffect } from 'react';
import Spinner from '../../layouts/Spinner';
import ProfileItem from '../profiles/ProfileItem';
import { getAllProfiles } from '../../../redux/actions/profileActions';
import { useSelector, useDispatch } from 'react-redux';

const Profiles = () => {
  const dispatch = useDispatch();
  const allProfiles = useSelector(state => state.profile);
  const { profiles, loading } = allProfiles; 
  // load profiles when comp loads
  useEffect(() => {
    dispatch(getAllProfiles());
  }, [dispatch]);

  return (
    <Fragment>
      {loading ? (
        <Spinner />
      ) : (
        <section className="profiles-page-wrapper">
          <h1>Members</h1>
          <p>List of all current users.</p>
          <div className="profiles">
            {profiles.length > 0 ? (
              profiles.map(profile => (
                <ProfileItem key={profile.id} profile={profile} />
              ))
            ) : (
              <h4>No profiles found...</h4>
            )}
          </div>
        </section>
      )}
    </Fragment>
  )
};
export default Profiles;   