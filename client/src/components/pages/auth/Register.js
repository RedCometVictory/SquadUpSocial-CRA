import React, { useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { setAlert } from '../../../redux/actions/alertActions';
import { register } from '../../../redux/actions/authActions';
import { useSelector, useDispatch } from "react-redux";

const Register = () => {
  const dispatch = useDispatch();
  // access this part of state...
  const userAuth = useSelector(state => state.auth);
  // const { isAuthenticated, loading } = userAuth;
  const { isAuthenticated } = userAuth;
  const [formRegData, setFormRegData] = useState({
    firstName: '', lastName: '',
    username: '', tagName: '',
    email: '', password: '',
    password2: '', avatar: null
  });

  const [fileTypeError, setFileTypeError] = useState(false);
  const [fileSizeError, setFileSizeError] = useState(false);

  const { firstName, lastName, username, tagName, email, password, password2 } = formRegData; // +{avatar}

  const onChange = (e) => {
    setFormRegData({ ...formRegData, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (e) => {
    let fileToUpload = e.target.files[0];
    checkFileType(fileToUpload);
    checkFileSize(fileToUpload);
    // setAvatar(e.target.files[0]);
      setFormRegData({
        ...formRegData,
        [e.target.name]: e.target.files[0]
      });
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    if (password !== password2) {
      dispatch(setAlert('Passwords do not match', 'danger'));
    } else {
      dispatch(register(formRegData));
    }
  };
  if (isAuthenticated) {
    return <Redirect to="/feed" />
  }

  // Check File Size and Type
  const checkFileType = (img) => {
    const types = ['image/png', 'image/jpg', 'image/jpeg', 'image/gif'];
    if (types.every(type => img.type !== type)) {
      return setFileTypeError(true);
    }
    return setFileTypeError(false);
  }

  const checkFileSize=(img)=>{
    let size = 3 * 1024 * 1024; // size limit 3mb
    if (img.size > size) {
      return setFileSizeError(true);
    }
    return setFileSizeError(false);
  }

  return (
    <section className="form-page-wrapper">
      <h1 className="section-header">Sign Up</h1>
      <p>
        <i className="fas fa-user" /> Create Your Account
      </p>
      <div className="form-container">
        <form className="form" onSubmit={onSubmit} >
          <div className="form__header">
            <small className="">Red labels are <span className="req-color">required</span>. Avatar image optional.</small>
          </div>
          <div className="form__inner-container">
            <div className="form__section">
              <div className="form__group">
                <input type="text" name="username" value={username} onChange={onChange} placeholder="White Owl-01 " aria-required="true" required/>
                <label htmlFor="username" className="form__label">
                  <span className="form__label-name">Username</span>
                </label>
              </div>
              <div className="form__group">
                <input type="text" name="tagName" value={tagName} onChange={onChange} placeholder="yellow canary11 (@yellow_canary11) " aria-required="true" required/>
                <label htmlFor="TagName" className="form__label">
                  <span className="form__label-name">Tag Name</span>
                </label>
              </div>
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
              <div className="form__group">
                <input type="password" name="password2" value={password2} onChange={onChange} placeholder="Repeat password to confirm. " aria-required="true" required/>
                <label htmlFor="password2" className="form__label">
                  <span className="form__label-name">Confirm Password</span>
                </label>
              </div>
            </div>
            <div className="form__section section-two">
              <div className="form__group">
                <input type="text" name="firstName" value={firstName} onChange={onChange} placeholder=" "/>
                <label htmlFor="firstName" className="form__label">
                  <span className="form__label-name">First Name<span className="form__label-desc"> (Optional)</span></span>
                </label>
              </div>
              <div className="form__group">
                <input type="text" name="lastName" value={lastName} onChange={onChange} placeholder=" "/>
                <label htmlFor="lastName" className="form__label">
                  <span className="form__label-name">Last Name<span className="form__label-desc"> (Optional)</span></span>
                </label>
              </div>
              <div className="form__group">
                <input type="file" accept=".jpeg, .jpg, .png, .gif" name="avatar" className="file-btn-input file-slim" onChange={handleAvatarChange} placeholder="Example: https://imgur.com/example.png "/>
                <label htmlFor="avatar" className="form file-btn-label file-slim">
                  Avatar
                </label>
              </div>
            </div>
          </div>
          <div className="form__footer">
            {fileTypeError || fileSizeError ? (
              <div className="form__error">
                File type or size limit exceeded: jpg, jpeg, png, gif only and size must be less than 3mb.
              </div>
            ) : (
              <input type="submit" className="btn btn-primary btn-full-width form__submit" value="Register" />
            )}
            <p>
              Already have an account?{" "}<Link to="/login"><span className="form form__link">Login.</span></Link>
            </p>
          </div>
        </form>
      </div>
    </section>
  )
};
export default Register;