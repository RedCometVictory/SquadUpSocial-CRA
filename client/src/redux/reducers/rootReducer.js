import { combineReducers } from 'redux'; // all reducers into one
import alertReducer from './alertReducer';
import authReducer from './authReducer';
// import circleReducer from './circleReducer';
import postReducer from './postReducer';
import profileReducer from './profileReducer';

// treat as global state - retreive via getState()
export default combineReducers({
  alert: alertReducer,
  auth: authReducer,
  post: postReducer,
  profile: profileReducer
})