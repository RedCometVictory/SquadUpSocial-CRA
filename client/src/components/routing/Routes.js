import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Alert from '../layouts/Alert';
import Register from '../pages/auth/Register';
import Login from '../pages/auth/Login';
import Profiles from '../pages/profiles/Profiles';
import Profile from '../pages/profile/Profile';
import NotFound from '../layouts/NotFound';
// private routes
import CreateProfile from '../pages/profile-forms/CreateProfile';
import Dashboard from '../dashboard/Dashboard'; // settings
import EditProfile from '../pages/profile-forms/EditProfile';
import Posts from '../pages/posts/Posts';  // user home
import Post from '../pages/post/Post';
// import CommentEditForm from '../pages/post/CommentEditForm';

// force user auth before access to components
import PrivateRoute from './PrivateRoute';
// pass the component to load as a component prop
const Routes = () => {
  return (
    <main className="container">
      <Alert />
      <Switch>
        <Route exact path="/register" component={Register} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/profiles" component={Profiles} />
        <Route exact path="/profile/:user_id" component={Profile} />
        <PrivateRoute exact path="/create-profile" component={CreateProfile} />
        <PrivateRoute exact path="/dashboard" component={Dashboard} />
        <PrivateRoute exact path="/edit-profile" component={EditProfile} />
        <PrivateRoute exact path="/feed" component={Posts} />
        <PrivateRoute exact path="/post/:post_id" component={Post} />
        {/* <PrivateRoute exact path="/post/edit-comment/:post_id/:comment_id" component={CommentEditForm} /> */}
        <Route component={NotFound} />
      </Switch>
    </main>
  )
}
export default Routes;