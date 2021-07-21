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
import { ACCOUNT_DELETED } from '../constants/profileConstants';
// axios used (via actions) to make requests to the backend

// init state used to get / fetch token from LS, if exists
// isAuthenticated pending val changes layout (navbar buttons)
// loading ensures that user is loaded, if user is authenticated, to ensure loading is done (res from server is received), then value is set to false when complete
// user obtains values via req to backend server. user obtains user data (username, email, etc.) as an object.

// central auth reducer state
const initialState = {
  token: localStorage.getItem('token'),
  isAuthenticated: null,
  loading: true,
  user: null
}

// pass state and action that's dispatched via request made
// export default (state = initialState, action) => {
const authReducer = (state = initialState, action) => {
  // case type order does not matter. payload contains user data. Each case returns state and user data. AUTH_ERROR and REGISTER_FAIL both do the same thing: clearing everything out of state, done to prevent tokens stored in LS to ever go invalid. Place returned token into LS - creating new token. Payload is an object containing the value of the token.
  const { type, payload } = action;

  // run action type:
  switch(type) {
    case USER_LOADED:
    case REGISTER_SUCCESS:
    case LOGIN_SUCCESS:
      // state is immutable, return a copy of prior state nd of the payload. isAuthenticated may return back as null, due to using JWT. Thus it is neccessary to keep querying the server (sending reqs) to keep checking to see if the token matches.
      return {
        ...state,
        ...payload,
        isAuthenticated: true,
        loading: false
      }
    case REGISTER_FAIL:
    case AUTH_ERROR:
    case LOGIN_FAILURE:
    case LOGOUT:
    case ACCOUNT_DELETED:
      return {
        ...state,
        token: null,
        // refreshToken: null,
        isAuthenticated: false,
        loading: false,
        user: null
      }
    default:
      return state;
  }
};
export default authReducer;