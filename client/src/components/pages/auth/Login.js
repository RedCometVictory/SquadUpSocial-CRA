import React, { useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { login } from '../../../redux/actions/authActions';
import { useSelector, useDispatch } from "react-redux";

const Login = () => {
  const dispatch = useDispatch();
  // access this part of state...
  const userAuth = useSelector(state => state.auth);
  // const { isAuthenticated, loading } = userAuth;
  const { isAuthenticated } = userAuth;
  const [formData, setFormData] = useState({
    email: '', password: ''
  });

  const { email, password } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    dispatch(login({ email, password }));
  }
  
  if (isAuthenticated) {
    // remove to avoid redirect to dashboard
    return <Redirect to="/feed" />
  }

  return (
    <section className="form-page-wrapper">
      <h1 className="section-header">Log In</h1>
      <p>
        <i className="fas fa-user" /> Sign into your Account
      </p>
      <div className="form-container">
        <form className="form" onSubmit={onSubmit}>
          <div className="form__header">
            <small className="">Red labels are <span className="req-color">required</span>.</small>
          </div>
          <div className="form__inner-container">
            <div className="form__section">
              <div className="form__group">
                <input type="email" name="email" value={email} onChange={onChange} placeholder="myemail123@mail.com " aria-required="true" required/>
                <label htmlFor="email" className="form__label">
                  <span className="form__label-name">E-Mail Address</span>
                </label>
              </div>
              <div className="form__group">
                <input type="password" name="password" value={password} onChange={onChange} placeholder="Must be 6 or more characters. " aria-required="true" required/>
                <label htmlFor="password" className="form__label">
                  <span className="form__label-name">Password</span>
                </label>
              </div>
            </div>
          </div>
          <div className="form__footer">
            <input type="submit" className="btn btn-primary btn-full-width form__submit" value="Login" />
            <p>
              Don't have an account?{" "}<Link to="/register"><span className="form form__link">Create one.</span></Link>
            </p>
          </div>
        </form>
      </div>
    </section>
  )
};
export default Login;