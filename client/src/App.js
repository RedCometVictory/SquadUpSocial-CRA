// import Axios from "axios";
import React, { Fragment, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Navbar from './components/layouts/Navbar';
import Landing from './components/layouts/Landing';
import Routes from './components/routing/Routes';

// Redux
import { Provider } from 'react-redux';
import store from './redux/store';
// import store from './redux/store.js';

import { loadUser, logout } from './redux/actions/authActions';

// upon loading app, USER_LOADED is run as this APP.js file is loaded. Token is provided via req.user.id and stored in LS
import setAuthToken from './utils/setAuthToken';
// for production build, comment out when using npm run watch
import './sass/styles.scss';

// set header w/token, if exists, dispatch w/ loadUser method from auth action
const App = () => {
  useEffect(() => {
    if (localStorage.token) {
      setAuthToken(localStorage.token);
    }
    store.dispatch(loadUser());
    
    // logout user from all tabs if logged out from one tab
    window.addEventListener('storage', ()=> {
      // if (!localStorage.token) store.dispatch({ type: LOGOUT });
      if (!localStorage.token) store.dispatch(logout());
    });
  }, []);
  return (
    <Provider store={store}>
    <Router>
        <Fragment>
          <Navbar />
          {/* <Route exact path="/" component={ Landing } /> */}
          <Switch>
          <Route exact path="/" component={ Landing } />
          <Route component={ Routes } />
          </Switch>
        </Fragment>
      </Router>
    </Provider>
  );
};
export default App;