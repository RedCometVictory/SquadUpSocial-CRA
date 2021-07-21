// require('dotenv').config();
import api from '../../utils/api';
import { setAlert } from './alertActions';
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGOUT,
  // TOKEN_REQUEST,
  // TOKEN_RECEIVED,
  // TOKEN_FAILURE
} from '../constants/authConstants';
import { CLEAR_PROFILE } from '../constants/profileConstants';
import { CLEAR_FEED_POSTS } from '../constants/postConstants';
import { registerForm } from '../../utils/formDataServices';
// const config = {
//   headers: {
//     'Content-Type': 'multipart/form-data'
//   }
// }
// set global header w/token
// import setAuthToken from '../../utils/setAuthToken';
// import authReducer from '../reducers/authReducer';

// const baseURL = 'http://localhost:5000/api';
// const baseURL = `${process.env.HEROKU_DOMAIN}/api`;
// const baseURL = `https://squadupsocial.herokuapp.com/api`;
// const baseURL = '/api';
// const baseURL = '/';
// loadUser - action checks to see if token exists, if so place token into global header (Authorization: "Bearer " + payload.token). Set global header if there is a token in LS.
// Treat user as logged in. Even if current tab is closed. Run this action dispatch (via App.js) as it only checks the first time the user loads.
// transfer data from action to reducer via dispatch
export const loadUser = () => async dispatch => {
  try {
    // if url reached - dispatch following (payload contains data sent from the url route, which is the user to the USER_LOADED action type in the auth reducer, thus using backend to change the front end state)
    // acess user id via state.auth.user.id
    const res = await api.get('/auth');
    // const res = await axios.get(baseURL + '/auth');
    // let resAuth = res.data.data;
    // console.log(resAuth);
    dispatch({
      type: USER_LOADED,
      payload: res.data.data
      // payload: res.data.data.user
    });
  } catch (err) {
    // dispatch error to the auth reducer
    dispatch({
      type: AUTH_ERROR
    });
  }
};

// export const refreshTokenRotation = () => async dispatch => {};

export const register = (formRegData) => async dispatch => {
  // prepare data to send as json format
  try {
    let servicedData = await registerForm(formRegData);
    // const res = await api.post("/users", formData)
    const res = await api.post("/users", servicedData)

    dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data.data
    });
    // for register and login comps, dispatch loadUser action upon success
    dispatch(loadUser());
    dispatch(setAlert('Successfully registered. Welcome.', 'success'));
  } catch (err) {
    const errors = err.response.data.errors;
    // pass msg and alert type
    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }
    dispatch({type: REGISTER_FAIL});
  }
};

// ensure login w/o having to re-register another user
// export const login = (email, password) => async dispatch => {
export const login = (formData) => async dispatch => {
  // const body = JSON.stringify({ email, password });
  try {
    // req to url, send config and body data
    const res = await api.post('/auth', formData);
    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data.data
    });

    // for both the register and login comps. dispatch the loadUser action upon success
    dispatch(loadUser());
    dispatch(setAlert('Welcome!', 'success'));
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }
    dispatch({type: LOGIN_FAILURE});
  }
};

export const logout = (history) => async dispatch => {
  // make api call
  dispatch({ type: CLEAR_PROFILE });
  dispatch({ type: CLEAR_FEED_POSTS });
  dispatch({ type: LOGOUT });
  // console.log("logging out user")
  history.push('/');
  dispatch(setAlert('Logout successful.', 'success'));
  // const res = await api.post('/auth/logout');
  await api.post('/auth/logout');
  // console.log("action, after res, user logged out")
  // console.log("redirecting to '/'")
};

// export function refreshToken(dispatch) {
//   var freshTokenPromise = fetchJWTToken()
//     .then(t => {
//       dispatch({
//         type: DONE_REFRESHING_TOKEN
//       });
//       dispatch(saveAppToken(t.token));
//         return t.token ? Promise.resolve(t.token) : Promise.reject({
//           message: 'could not refresh token'
//         });
//     })
//     .catch(e => {
//       console.log('error refreshing token', e);
//       dispatch({
//         type: DONE_REFRESHING_TOKEN
//       });
//       return Promise.reject(e);
//   });
//   dispatch({
//     type: REFRESHING_TOKEN,
//     // we want to keep track of token promise in the state so that we don't try to refresh
//     // the token again while refreshing is in process
//     freshTokenPromise
//   });
//   return freshTokenPromise;
// }