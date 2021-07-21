import api from '../../utils/api';
import { setAlert } from './alertActions';
import {
  GET_PROFILES,
  GET_PROFILE,
  FOLLOW_PROFILE,
  UNFOLLOW_PROFILE,
  UPDATE_PROFILE,
  DELETE_PROFILE,
  CLEAR_PROFILE,
  PROFILE_ERROR,
  ACCOUNT_DELETED,
  FOLLOWING_PROFILE_LIST,
  FOLLOWERS_PROFILE_LIST
} from '../constants/profileConstants';
import { CLEAR_FEED_POSTS, CLEAR_POST } from '../constants/postConstants';
import { addProfileForm, editProfileForm } from '../../utils/formDataServices';

export const getAllProfiles = () => async dispatch => {
  dispatch ({
    type: CLEAR_PROFILE
  });
  try {
    const res = await api.get('/profile');
    dispatch({
      type: GET_PROFILES,
      payload: res.data.data.profiles
    });
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

export const getProfileById = (user_id) => async dispatch => {
  try {
    const res = await api.get(`/profile/user/${user_id}`);
    dispatch({
      type: GET_PROFILE,
      payload: res.data.data
    });
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
    dispatch(setAlert('Failed to get profile.', 'danger'));
  }
};

export const getCurrentUserAccountSettings = () => async dispatch => {
  dispatch ({ type: CLEAR_PROFILE });
  try {
    const res = await api.get(`/profile/me`);
    // let resProfile = res.data.data;
    dispatch({
      type:GET_PROFILE,
      payload: res.data.data
    });
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

export const createProfile = (formData, history, edit = false) => async dispatch => {
  try {
    let servicedData = await addProfileForm(formData);
    // const res = await api.post('/profile', formData);
    const res = await api.post('/profile', servicedData);
    let response = res.data;
    dispatch({
      type: GET_PROFILE,
      payload: response.data
    });
    dispatch(setAlert('User profile created.', 'success'));
    // redirecting is a bit different w/actions and cannot use <Redirect /> that is available for react routes. Must utilize history object with push method.
    if (!edit) {
      history.push('/dashboard');
    }
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
    dispatch(setAlert('Failed to create profile.', 'danger'));
  }
};

export const editProfile = (formData, history, edit = false) => async dispatch => {
  try {
    let servicedData = await editProfileForm(formData);
    const res = await api.put(`/profile/me`, servicedData);
    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data.data
    });
    dispatch(setAlert('Profile Updated.', 'success'));
    if (edit) {
      history.push('/dashboard');
    };
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
    dispatch(setAlert('Failed to update profile.', 'danger'));
  }
};

export const followProfile = (userId) => async dispatch => {
  try {
    const res = await api.get(`/profile/follow/${userId}`);
    dispatch({
      type: FOLLOW_PROFILE,
      payload: res.data.data
    });
    dispatch(setAlert('Following profile.', 'success'));
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
    dispatch(setAlert('Failed to follow profile.', 'danger'));
  }
};

export const unfollowProfile = (userId) => async dispatch => {
  try {
    const res = await api.delete(`/profile/unfollow/${userId}`);
    dispatch({
      type: UNFOLLOW_PROFILE,
      payload: res.data.data
    });
    dispatch(setAlert('Unfollowed profile.', 'success'));
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
    dispatch(setAlert('Failed to unfollow profile.', 'danger'));
  }
};

export const deleteProfile = (history) => async dispatch => {
  dispatch({ type: CLEAR_PROFILE });
  dispatch({ type: CLEAR_POST});
  dispatch({ type: CLEAR_FEED_POSTS });
  try {
    await api.delete('/profile');
    // const res = await api.delete('/profile');
    dispatch({ type: DELETE_PROFILE });
    dispatch({ type: ACCOUNT_DELETED });
    history.push('/'); // redirect to landing
    dispatch(setAlert('Your account has been deleted.', 'success'));
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
    dispatch(setAlert('Failed to delete account.', 'danger'));
  }
};

export const getAllFollowingProfiles = () => async dispatch => {
  try {
    const res = await api.get('/profile/all-followed-users');
    dispatch({
      type: FOLLOWING_PROFILE_LIST,
      payload: res.data.data.following
    });
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

export const getAllFollowersProfiles = () => async dispatch => {
  try {
    const res = await api.get('/profile/all-following-me');
    dispatch({
      type: FOLLOWERS_PROFILE_LIST,
      payload: res.data.data.followers
    });
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};