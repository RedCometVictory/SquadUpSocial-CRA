import React, { useState, useEffect, Fragment } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';
// useSelector brings selected parts of state into the component to populate the state with values, useDispatch calls actions
import { useSelector, useDispatch } from "react-redux";
import { logout } from '../../redux/actions/authActions';
// pass props from state into function component

const Navbar = () => {
  // call actions to update reducers / state
  const dispatch = useDispatch();
  const history = useHistory();
  // bring in authReducer state into the component, via rootReducer
  const userAuth = useSelector((state) => state.auth);
  // const { isAuthenticated, loading } = userAuth;
  const { isAuthenticated } = userAuth;

  // prevent flash of incorrect theme
  let currentTheme = localStorage.getItem('theme');
  if (!currentTheme) {
    localStorage.setItem('theme', 'light');
  }
  const [ colorTheme, setColorTheme ] = useState(currentTheme);
  
  useEffect(() => {
    // check for selected theme in LS
    const checkCurrTheme = localStorage.getItem('theme');
    // if true, set as current theme value in state
    if (checkCurrTheme) {
      setColorTheme(checkCurrTheme);
    }
  }, []);
  
  const themeSelect = (theme) => {
    setColorTheme(theme);
    localStorage.setItem('theme', theme)
  }

  const handleLogout = () => {
    dispatch(logout(history));
  }
  // /feed is for all posts of users followed and self
  const authLinks = (
    <Fragment>
      <li className="nav__item">
        <Link to="/feed" className="nav__link">Feed</Link>
      </li>
      <li className="nav__item">
        <Link to="/dashboard" className="nav__link">Dashboard</Link>
      </li>
      <li className="nav__item">
        <a className="nav__link" href="\\" onClick={handleLogout}>Logout</a>
      </li>
    </Fragment>
  );
  const guestLinks = (
    <Fragment>
      <li className="nav__item">
        <Link to="/register" className="nav__link">Sign Up</Link>
      </li>
      <li className="nav__item">
        <Link to="/login" className="nav__link">Login</Link>
      </li>
    </Fragment>
  );
  return (
    <HelmetProvider>
    <header className="nav__header">
      <Helmet>
        <html className={colorTheme} />
      </Helmet>
      <div className="nav__logo">
        <h1><Link to="/" className="logo">SquadUp</Link></h1>
      </div>
      {/* <input type="checkbox" id="toggler" className="toggler"/> */}
      {/* <label htmlFor="toggler" className="burger">
        <span><i className="fas fa-bars"></i></span>
      </label> */}
      <div tabIndex="0" className="burger">
        <i className="fas fa-bars"></i>
        <div className="nav-container row">
          <nav className="nav">
            <ul className="nav__item-list">
              <li className="nav__item">
                <Link to="/profiles" className="nav__link">Members</Link>
              </li>
              {/* <li className="nav__item">
                <Link to="/about" className="nav__link">About</Link>
              </li> */}
              <Fragment>{isAuthenticated ? authLinks : guestLinks }</Fragment>
            </ul>
          </nav>
        </div>
      </div>
      <input type="checkbox" id="theme-toggle" className="theme-toggler"/>
      <label htmlFor='theme-toggle' className="theme-selection">
        <span className="fas fa-caret-down"></span>
        {/* <span className="caret"></span> */}
      </label>
      <div className="theme theme-container">
        <ul className="theme__item-list dropdown">
          <li className="theme__item active" onClick={() => themeSelect('light')}>
            <div className="theme__link light"></div>
          </li>
          <li className="theme__item active" onClick={() => themeSelect('dark')}>
            <div className="theme__link dark"></div>
          </li>
          <li className="theme__item active" onClick={() => themeSelect('purple-prime')}>
            <div className="theme__link purple-prime"></div>
          </li>
          <li className="theme__item active" onClick={() => themeSelect('bee')}>
            <div className="theme__link bee"></div>
          </li>
          <li className="theme__item active" onClick={() => themeSelect('redcomet')}>
            <div className="theme__link redcomet"></div>
          </li>
        </ul>
      </div>
    </header>
    </HelmetProvider>
  );
};

export default Navbar;