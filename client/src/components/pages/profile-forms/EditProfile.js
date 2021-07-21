/*
import React, { useState, useEffect, Fragment } from 'react';
// withRouter allows for redirection in action w/history object, apply () around the name of this component, at the bottom of this file in order to apply the history object and use it via an action
import { Link, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { editProfile, getCurrentUserAccountSettings } from '../../../redux/actions/profileActions';
// each form input counts as a piece of state, useState ensures inputs and forms work properly. useState consists of two values in an array. the first being the instance of state & the second being the function used to interact w/the state.
// execute createProfile upon submit - { history }, call to access the history via props.history
// upon submit alert should generate due to backend requirements, via the profile action 

// may have get the details of f_name through user_avatar via importing the user reducer state (derived by loadUser()), upon submitting this form - update the profileUserData portion of the profile state and the respective properties of the user state
// an alteernative would be utilizing the profileUserData portion of the porfile state, then user state can be 'ignored'

// ccould potentially rename f_name to firstname?
// alt: f_name can take value from variabble named firstName
const initialState = {
  f_name: '', l_name: '',
  username: '', tag_name: '',
  user_email: '', user_avatar: '',
  address: '', address2: '',
  city: '', state: '',
  country: '', zipcode: '',
  gender: '', birthday: '',
  company: '', status: '',
  interests: '', // ensure this is an arr
  bio: '', background_image: '',
  youtube: '', facebook: '',
  twitter: '', instagram: '',
  linkedin: '', twitch: '',
  pinterest: '', reddit: ''
}

const EditProfile = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const profileData = useSelector(state => state.profile);
  const { profileUserData, profileStats, loading } = profileData;
  const [formProfileData, setFormProfileData] = useState(initialState);
  // toggle social media links, button used for onclick, pass opposite value of current bool state, false to true - true to false
  const [displaySocialInputs, toggleSocialInputs] = useState(false);
  // use useState keys as variables, destructure from formData
  // useEffect allows us to run getGetCurrentProfile action - to fetch the data and send it down through state
  // retrieve data from profile w/action method, set formData (current profile values). Call setFormData after we get a profile and run validation checks on all properties to ensure that if the values are 'stuck' loading OR are not profile value(s), then the fields are filled in as blank, however if there are valid values (and are not loading) then they shall be filled into the form fields.
  useEffect(() => {
    dispatch(getCurrentUserAccountSettings());
    
    // validate field properties
    // f_name: loading || !profileUserData ? '' : profileUserData.firstName,
    setFormProfileData({
      f_name: loading || !profileUserData ? '' : profileUserData.f_name,
      l_name: loading || !profileUserData ? '' : profileUserData.l_name,
      username: loading || !profileUserData ? '' : profileUserData.username,
      tag_name: loading || !profileUserData ? '' : profileUserData.tag_name,
      user_email: loading || !profileUserData ? '' : profileUserData.user_email,
      user_avatar: loading || !profileUserData ? '' : profileUserData.user_avatar,
      address: loading || !profileStats ? '' : profileStats.profileDetails.address,
      address2: loading || !profileStats ? '' : profileStats.profileDetails.address_2,
      city: loading || !profileStats ? '' : profileStats.profileDetails.city,
      state: loading || !profileStats ? '' : profileStats.profileDetails.state,
      country: loading || !profileStats ? '' : profileStats.profileDetails.country,
      zipcode: loading || !profileStats ? '' : profileStats.profileDetails.zipcode,
      gender: loading || !profileStats ? '' : profileStats.profileDetails.gender,
      birthday: loading || !profileStats ? '' : profileStats.profileDetails.birth_date,
      company: loading || !profileStats ? '' : profileStats.profileDetails.company,
      status: loading || !profileStats ? '' : profileStats.profileDetails.status,
      // interests: loading || !profileStats ? '' : profileStats.profileDetails.interests,
      // interests: loading || !profileStats ? '' : profileStats.profileDetails.interests.join(', '),
      interests: loading || !profileStats ? '' : profileStats.profileDetails.interests.length === 0 ? '' : profileStats.profileDetails.interests.join(', '),
      bio: loading || !profileStats ? '' : profileStats.profileDetails.bio,
      background_image: loading || !profileStats ? '' : profileStats.profileDetails.background_image,
      youtube: loading || !profileStats.profileSocials.youtube_url ? '' : profileStats.profileSocials.youtube_url,
      facebook: loading || !profileStats.profileSocials.facebook_url ? '' : profileStats.profileSocials.facebook_url,
      twitter: loading || !profileStats.profileSocials.twitter_url ? '' : profileStats.profileSocials.twitter_url,
      instagram: loading || !profileStats.profileSocials.instagram_url ? '' : profileStats.profileSocials.instagram_url,
      linkedin: loading || !profileStats.profileSocials.linkedin_url ? '' : profileStats.profileSocials.linkedin_url,
      twitch: loading || !profileStats.profileSocials.twitch_url ? '' : profileStats.profileSocials.twitch_url,
      pinterest: loading || !profileStats.profileSocials.pinterest_url ? '' : profileStats.profileSocials.pinterest_url,
      reddit: loading || !profileStats.profileSocials.reddit_url ? '' : profileStats.profileSocials.reddit_url
    });
    // setAvatarImage({user_avatar: loading || !profileUserData ? '' : profileUserData.user_avatar});
    // setBackgroundImage({background_image: loading || !profileStats ? '' : profileStats.profileDetails.background_image});
  }, [loading, dispatch]);
  // }, [loading, dispatch, profileStats, profileUserData]);
  // }, [loading, dispatch, getCurrentUserAccountSettings]);
  // [] prevents useEffect repeating itself, loading is the prop condition depended upon, so when it loads (becomes true) is when useEffect content will run.

  const {
    f_name, l_name,
    username, tag_name,
    user_email, // user_avatar,
    address, address2,
    city, state,
    country, zipcode,
    gender, birthday,
    company, status,
    interests, // ensure this is an arr
    bio, // background_image,
    youtube, facebook,
    twitter, instagram,
    linkedin, twitch,
    pinterest, reddit
  } = formProfileData;

  // inputs have onchange - whatever is placed in the input value will be placed into the state. all inputs place a value attribute that equals the value of the keyname found in the state
  const onChange = e => setFormProfileData({ ...formProfileData, [e.target.name]: e.target.value });
  const handleAvatarImageChange = (e) => {
    // setAvatarImage(e.target.files[0]);
    setFormProfileData({
      ...formProfileData,
      [e.target.name]: e.target.files[0]
    });
  };
  const handleBackgroundImageChange = (e) => {
    // setBackgroundImage(e.target.files[0]);
    setFormProfileData({
      ...formProfileData,
      [e.target.name]: e.target.files[0]
    });
  };

  const onSubmit = e => {
    e.preventDefault();
    dispatch(editProfile(formProfileData, history, true));
  }

  return (
    <section className="form-page-wrapper">
      <h2>Edit Your User Data and Profile</h2>
      <p><i className="fas fa-user"></i> Make edits to your personal data.</p>
      <div className="form-container">
        <form className="form" onSubmit={onSubmit}>
          <div className="form__header">
              <small className="">Red labels are <span className="req-color">required</span>. Profile Header image is recommended.</small>
          </div>
          <div className="form__inner-container">
            <div className="form__section">
              <div className="form__group">
                <input
                  type="text"
                  placeholder="BestGamer11"
                  name="username"
                  value={username}
                  onChange={e => onChange(e)}
                  aria-required="true"
                  required
                />
                <label htmlFor="username" className="form__label">
                  <span className="form__label-name">Username</span>
                </label>
              </div>
              <div className="form__group">
                <input
                  type="text"
                  placeholder="BestGamer11"
                  name="tag_name"
                  value={tag_name}
                  onChange={e => onChange(e)}
                  aria-required="true"
                  required
                />
                <label htmlFor="tag_name" className="form__label">
                  <span className="form__label-name">Tag Name</span>
                </label>
              </div>
              <div className="form__group">
                <input
                  type="text"
                  placeholder="bestgamer11@mail.com"
                  name="user_email"
                  value={user_email}
                  onChange={e => onChange(e)}
                  aria-required="true"
                  required
                />
                <label htmlFor="user_email" className="form__label">
                  <span className="form__label-name">Email</span>
                </label>
              </div>
            </div>
            <div className="form__section section-two">
              <div className="form__group">
                <input
                  type="text"
                  placeholder="Lastname"
                  name="l_name"
                  value={l_name}
                  onChange={e => onChange(e)}
                />
                <label htmlFor="l_name" className="form__label">
                  <span className="form__label-name">Last Name</span>
                </label>
              </div>
              <div className="form__group">
                <input
                  type="text"
                  placeholder="Firstname"
                  name="f_name"
                  value={f_name}
                  onChange={e => onChange(e)}
                />
                <label htmlFor="f_name" className="form__label">
                  <span className="form__label-name">First Name</span>
                </label>
              </div>
              <div className="form__group">
                <input
                  type="file"
                  accept=".jpeg, .jpg, .png, .gif"
                  placeholder=".jpeg, .jpg, .png, .gif files only"
                  name="user_avatar"
                  className="file-btn-input file-slim"
                  // value={user_avatar}
                  onChange={handleAvatarImageChange}
                />
                <label htmlFor="user_avatar" className="form file-btn-label file-slim">
                  Avatar
                </label>
              </div>
            </div>
          </div>
          <div className="form__group bio-input">
            <label htmlFor="bio" className="form__alt-label">
              <span className="form__label-name--above">Bio</span>
            </label>
            <textarea
              placeholder="A short bio of yourself!"
              name="bio"
              value={bio}
              rows="5"
              onChange={e => onChange(e)}
            ></textarea>
          </div>
          <div className="form__inner-container">
            <div className="form__section">
              <div className="form__group background-img-mrg-sm">
                <input
                  type="file"
                  accept=".jpeg, .jpg, .png, .gif"
                  placeholder=".jpeg, .jpg, .png, .gif files only"
                  name="background_image"
                  className="file-btn-input file-slim"
                  // value={background_image}
                  onChange={handleBackgroundImageChange}
                />
                <label htmlFor="background_image" className="form file-btn-label file-slim">
                  Header
                </label>
              </div>
              <div className="form__group">
                <input
                  aria-required="true"
                  required
                  type="date"
                  name="birthday"
                  value={birthday}
                  onChange={e => onChange(e)}
                  placeholder=" "
                />
                <label htmlFor="birthday" className="form__label">
                  <span className="form__label-name">Birthday</span>
                </label>
              </div>
              <div className="form__group">
                <input                  
                  type="text"
                  name="address"
                  value={address}
                  onChange={e => onChange(e)}
                  placeholder="1234 N. Abby Street"
                />
                <label htmlFor="address" className="form__label">
                  <span className="form__label-name">Address</span>
                </label>
              </div>
              <div className="form__group">
                <input                  
                  type="text"
                  name="address2"
                  value={address2}
                  onChange={e => onChange(e)}
                  placeholder="1111 S. Peach Ave."
                />
                <label htmlFor="address2" className="form__label">
                  <span className="form__label-name">Address 2</span>
                </label>
              </div>
              <div className="form__group">
                <input
                  type="text"
                  name="city"
                  value={city}
                  onChange={e => onChange(e)}
                  placeholder="Jackson"
                />
                <label htmlFor="city" className="form__label">
                  <span className="form__label-name">City</span>
                </label>
              </div>
              <div className="form__group">
                <input
                  type="text"
                  name="state"
                  value={state}
                  onChange={e => onChange(e)}
                  placeholder="Mississippi"
                />
                <label htmlFor="state" className="form__label">
                  <span className="form__label-name">State</span>
                </label>
              </div>
              <div className="form__group">
                <input
                  type="text"
                  name="country"
                  value={country}
                  onChange={e => onChange(e)}
                  placeholder="United States"
                />
                <label htmlFor="country" className="form__label">
                  <span className="form__label-name">Country</span>
                </label>
              </div>
              <div className="form__group">
                <input
                  type="text"
                  name="zipcode"
                  value={zipcode}
                  onChange={e => onChange(e)}
                  placeholder="12345"
                />
                <label htmlFor="zipcode" className="form__label">
                  <span className="form__label-name">Zip Code</span>
                </label>
              </div>
              <div className="form__group">
                <input
                  type="text"
                  name="company"
                  value={company}
                  onChange={e => onChange(e)}
                  placeholder="Workplace Co. Ltd."
                />
                <label htmlFor="company" className="form__label">
                  <span className="form__label-name">Company</span>
                </label>
              </div>
              <div className="form__group">
                <input
                  type="text"
                  placeholder="Biking, Fishing, Mountain Climbing, Swimming, Competitive Boxing"
                  name="interests"
                  value={interests}
                  onChange={e => onChange(e)}
                />
                <label htmlFor="interests" className="form__label">
                  <span className="form__label-name">Interests</span>
                </label>
              </div>
              <div className="form__group select-spacer">
                <select name="gender" value={gender} onChange={e => onChange(e)}>
                  <option> Select Gender</option>
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Other">Other</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>              
              </div>
              <div className="form__group">
                <select name="status" value={status} onChange={e => onChange(e)}>
                  <option> Select Status</option>
                  <option value="Happy">Feeling Happy</option>
                  <option value="Sad">Feeling Sad</option>
                  <option value="Sleepy">Feeling Sleepy</option>
                  <option value="Angry">Feeling Angry</option>
                  <option value="Relaxing">Relaxing</option>
                  <option value="Vacation">On a Vacation</option>
                  <option value="College">Attending College / University</option>
                  <option value="Study">Studying for a test / something important</option>
                  <option value="Instructor">I'm a Teacher</option>
                  <option value="Intern">Interning</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
            <div className="form__section section-two">
              <div className="form__toggle-btn">
                <button type="button" className="btn btn-secondary btn-full-width" onClick={() => toggleSocialInputs(!displaySocialInputs)}>Add Social Network Links <span>(Optional)</span>
                </button>
              </div>
              {displaySocialInputs && (
                <Fragment>
                  <div className="form__group social-input">
                    <input type="text" placeholder="YouTube URL" name="youtube" value={youtube} onChange={e => onChange(e)} />
                    <label htmlFor="youtube" className="form__label">
                      <span className="form__label-name">
                      Youtube URL 
                      </span>
                    </label>
                  </div>
                  <div className="form__group social-input">
                    <input type="text" placeholder="Facebook URL" name="facebook" value={facebook} onChange={e => onChange(e)} />
                    <label htmlFor="facebook" className="form__label">
                      <span className="form__label-name">
                        Facebook URL 
                      </span>
                    </label>
                  </div>
                  <div className="form__group social-input">
                    <input type="text" placeholder="Twitter URL" name="twitter" value={twitter} onChange={e => onChange(e)} />
                    <label htmlFor="twitter" className="form__label">
                      <span className="form__label-name">
                        Twitter URL 
                      </span>
                    </label>
                  </div>
                  <div className="form__group social-input">
                    <input type="text" placeholder="Instagram URL" name="instagram"  value={instagram} onChange={e => onChange(e)} />
                    <label htmlFor="instagram" className="form__label">
                      <span className="form__label-name">
                        Instagram URL 
                      </span>
                    </label>
                  </div>
                  <div className="form__group social-input">
                    <input type="text" placeholder="Linkedin URL" name="linkedin" value={linkedin} onChange={e => onChange(e)} />
                    <label htmlFor="linkedin" className="form__label">
                      <span className="form__label-name">
                        Linkedin URL 
                      </span>
                    </label>
                  </div>
                  <div className="form__group social-input">
                    <input type="text" placeholder="Twitch URL" name="twitch" value={twitch} onChange={e => onChange(e)} />
                    <label htmlFor="twitch" className="form__label">
                      <span className="form__label-name">
                        Twitch URL 
                      </span>
                    </label>
                  </div>
                  <div className="form__group social-input">
                    <input type="text" placeholder="Pinterest URL" name="pinterest" value={pinterest} onChange={e => onChange(e)} />
                    <label htmlFor="pinterest" className="form__label">
                      <span className="form__label-name">
                        Pinterest URL 
                      </span>
                    </label>
                  </div>
                  <div className="form__group social-input">
                    <input type="text" placeholder="Reddit URL" name="reddit" value={reddit} onChange={e => onChange(e)} />
                    <label htmlFor="reddit" className="form__label">
                      <span className="form__label-name">
                        Reddit URL 
                      </span>
                    </label>
                  </div>
                </Fragment>
              )}
            </div>
          </div>
          <div className="form__footer">
            <input type="submit" className="btn btn-primary btn-full-width form__submit" value="Update Profile" />
            <div className="form__toggle-btn">
              <Link className="btn btn-secondary form__toggle-btn" to="/dashboard">
                Go Back
              </Link>              
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}
export default EditProfile;
*/



























import React, { useState, useEffect, Fragment } from 'react';
// withRouter allows for redirection in action w/history object, apply () around the name of this component, at the bottom of this file in order to apply the history object and use it via an action
import { Link, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { editProfile, getCurrentUserAccountSettings } from '../../../redux/actions/profileActions';
// each form input counts as a piece of state, useState ensures inputs and forms work properly. useState consists of two values in an array. the first being the instance of state & the second being the function used to interact w/the state.
// execute createProfile upon submit - { history }, call to access the history via props.history
// upon submit alert should generate due to backend requirements, via the profile action 

// may have get the details of f_name through user_avatar via importing the user reducer state (derived by loadUser()), upon submitting this form - update the profileUserData portion of the profile state and the respective properties of the user state
// an alteernative would be utilizing the profileUserData portion of the porfile state, then user state can be 'ignored'

// ccould potentially rename f_name to firstname?
// alt: f_name can take value from variabble named firstName
const initialState = {
  f_name: '', l_name: '',
  username: '', tag_name: '',
  user_email: '', user_avatar: '',
  address: '', address2: '',
  city: '', state: '',
  country: '', zipcode: '',
  gender: '', birthday: '',
  company: '', status: '',
  interests: '', // ensure this is an arr
  bio: '', background_image: '',
  youtube: '', facebook: '',
  twitter: '', instagram: '',
  linkedin: '', twitch: '',
  pinterest: '', reddit: ''
}

const EditProfile = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const profileData = useSelector(state => state.profile);
  const { profileUserData, profileStats, loading } = profileData;
  const [formProfileData, setFormProfileData] = useState(initialState);
  // toggle social media links, button used for onclick, pass opposite value of current bool state, false to true - true to false
  const [displaySocialInputs, toggleSocialInputs] = useState(false);
  // use useState keys as variables, destructure from formData
  // useEffect allows us to run getGetCurrentProfile action - to fetch the data and send it down through state
  // retrieve data from profile w/action method, set formData (current profile values). Call setFormData after we get a profile and run validation checks on all properties to ensure that if the values are 'stuck' loading OR are not profile value(s), then the fields are filled in as blank, however if there are valid values (and are not loading) then they shall be filled into the form fields.
  // ***** Validate File Type *****
  const [avatarTypeError, setAvatarTypeError] = useState(false);
  // ***** Validate File Size *****
  const [avatarSizeError, setAvatarSizeError] = useState(false);

  const [backgroundTypeError, setBackgroundTypeError] = useState(false);
  const [backgroundSizeError, setBackgroundSizeError] = useState(false);
  
  useEffect(() => {
    dispatch(getCurrentUserAccountSettings());
    
    // validate field properties
    // f_name: loading || !profileUserData ? '' : profileUserData.firstName,
    setFormProfileData({
      f_name: loading || !profileUserData ? '' : profileUserData.f_name,
      l_name: loading || !profileUserData ? '' : profileUserData.l_name,
      username: loading || !profileUserData ? '' : profileUserData.username,
      tag_name: loading || !profileUserData ? '' : profileUserData.tag_name,
      user_email: loading || !profileUserData ? '' : profileUserData.user_email,
      user_avatar: loading || !profileUserData ? '' : profileUserData.user_avatar,
      address: loading || !profileStats ? '' : profileStats.profileDetails.address,
      address2: loading || !profileStats ? '' : profileStats.profileDetails.address_2,
      city: loading || !profileStats ? '' : profileStats.profileDetails.city,
      state: loading || !profileStats ? '' : profileStats.profileDetails.state,
      country: loading || !profileStats ? '' : profileStats.profileDetails.country,
      zipcode: loading || !profileStats ? '' : profileStats.profileDetails.zipcode,
      gender: loading || !profileStats ? '' : profileStats.profileDetails.gender,
      birthday: loading || !profileStats ? '' : profileStats.profileDetails.birth_date,
      company: loading || !profileStats ? '' : profileStats.profileDetails.company,
      status: loading || !profileStats ? '' : profileStats.profileDetails.status,
      // interests: loading || !profileStats ? '' : profileStats.profileDetails.interests,
      // interests: loading || !profileStats ? '' : profileStats.profileDetails.interests.join(', '),
      interests: loading || !profileStats ? '' : profileStats.profileDetails.interests.length === 0 ? '' : profileStats.profileDetails.interests.join(', '),
      bio: loading || !profileStats ? '' : profileStats.profileDetails.bio,
      background_image: loading || !profileStats ? '' : profileStats.profileDetails.background_image,
      youtube: loading || !profileStats.profileSocials.youtube_url ? '' : profileStats.profileSocials.youtube_url,
      facebook: loading || !profileStats.profileSocials.facebook_url ? '' : profileStats.profileSocials.facebook_url,
      twitter: loading || !profileStats.profileSocials.twitter_url ? '' : profileStats.profileSocials.twitter_url,
      instagram: loading || !profileStats.profileSocials.instagram_url ? '' : profileStats.profileSocials.instagram_url,
      linkedin: loading || !profileStats.profileSocials.linkedin_url ? '' : profileStats.profileSocials.linkedin_url,
      twitch: loading || !profileStats.profileSocials.twitch_url ? '' : profileStats.profileSocials.twitch_url,
      pinterest: loading || !profileStats.profileSocials.pinterest_url ? '' : profileStats.profileSocials.pinterest_url,
      reddit: loading || !profileStats.profileSocials.reddit_url ? '' : profileStats.profileSocials.reddit_url
    });
    // setAvatarImage({user_avatar: loading || !profileUserData ? '' : profileUserData.user_avatar});
    // setBackgroundImage({background_image: loading || !profileStats ? '' : profileStats.profileDetails.background_image});
  }, [loading, dispatch]);
  // }, [loading, dispatch, getCurrentUserAccountSettings]);
  // [] prevents useEffect repeating itself, loading is the prop condition depended upon, so when it loads (becomes true) is when useEffect content will run.

  const {
    f_name, l_name,
    username, tag_name,
    user_email, // user_avatar,
    address, address2,
    city, state,
    country, zipcode,
    gender, birthday,
    company, status,
    interests, // ensure this is an arr
    bio, // background_image,
    youtube, facebook,
    twitter, instagram,
    linkedin, twitch,
    pinterest, reddit
  } = formProfileData;

  // inputs have onchange - whatever is placed in the input value will be placed into the state. all inputs place a value attribute that equals the value of the keyname found in the state
  const onChange = e => setFormProfileData({ ...formProfileData, [e.target.name]: e.target.value });

  const handleAvatarImageChange = (e) => {
    // setAvatarImage(e.target.files[0]);
    let inputName = e.target.name;
    // check file type
    let fileToUpload = e.target.files[0];
    checkFileType(fileToUpload, inputName);
    // check file size
    checkFileSize(fileToUpload, inputName);
    setFormProfileData({
      ...formProfileData,
      [e.target.name]: e.target.files[0]
    });
  };
  const handleBackgroundImageChange = (e) => {
    // setBackgroundImage(e.target.files[0]);
    let inputName = e.target.name;
    // check file type
    // pass input name as 2nd ar
    let fileToUpload = e.target.files[0];
    checkFileType(fileToUpload, inputName);
    // check file size
    checkFileSize(fileToUpload, inputName);
    setFormProfileData({
      ...formProfileData,
      [e.target.name]: e.target.files[0]
    });
  };
  // ********* Check File Size and Type ***********
  // check file type
  const checkFileType = (img, name) => {
    const types = ['image/png', 'image/jpg', 'image/jpeg', 'image/gif'];
    // if name choose which state to effect
    if (types.every(type => img.type !== type)) {
      if (name === 'user_avatar') {
        return setAvatarTypeError(true);
      }
      // return (
        // setAvatarTypeError(true)
      // )
    // }
    // if (types.every(type => img.type !== type)) {
      if (name === 'background_image') {
        return setBackgroundTypeError(true);
      }
      // return (
        // setBackgroundTypeError(true)
      // )
      
    }
    if (types.every(type => img.type === type)) {
      if (name === 'user_avatar') {
        return setAvatarTypeError(false);
      }
        // setAvatarTypeError(true)
      if (name === 'background_image') {
        return setBackgroundTypeError(false);
      }
        // setBackgroundTypeError(true))
      
    }

    // return (
    // setAvatarTypeError(false) // ,
    // if (backgroundTypeError === !true) {
      // setBackgroundTypeError(false)
    // }
    // )
  }

  const checkFileSize=(img, name)=>{
    let size = 3 * 1024 * 1024; // size limit 3mb
    if (img.size > size) {
      if (name === 'user_avatar') {
        return setAvatarSizeError(true);
      }
      if (name === 'background_image') {
        // return setAvatarSizeError(true);
        return setBackgroundSizeError(true);
      }
    }
    if (img.size < size) {
      if (name === 'user_avatar') {
        return setAvatarSizeError(false);
      }
      if (name === 'background_image') {
        return setBackgroundSizeError(false);
      }
    }
    // return (
    // setAvatarSizeError(false) // ,
    // if (backgroundSizeError === !true) {
      // setBackgroundSizeError(false)
    // }
    // )
  }
  // ****************************************

  const onSubmit = e => {
    e.preventDefault();
    dispatch(editProfile(formProfileData, history, true));
  }

  return (
    <section className="form-page-wrapper">
      <h2>Edit Your User Data and Profile</h2>
      <p><i className="fas fa-user"></i> Make edits to your personal data.</p>
      <div className="form-container">
        <form className="form" onSubmit={onSubmit}>
          <div className="form__header">
              <small className="">Red labels are <span className="req-color">required</span>. Profile Header image is recommended.</small>
          </div>
          <div className="form__inner-container">
            <div className="form__section">
              <div className="form__group">
                <input
                  type="text"
                  placeholder="BestGamer11"
                  name="username"
                  value={username}
                  onChange={e => onChange(e)}
                  aria-required="true"
                  required
                />
                <label htmlFor="username" className="form__label">
                  <span className="form__label-name">Username</span>
                </label>
              </div>
              <div className="form__group">
                <input
                  type="text"
                  placeholder="BestGamer11"
                  name="tag_name"
                  value={tag_name}
                  onChange={e => onChange(e)}
                  aria-required="true"
                  required
                />
                <label htmlFor="tag_name" className="form__label">
                  <span className="form__label-name">Tag Name</span>
                </label>
              </div>
              <div className="form__group">
                <input
                  type="text"
                  placeholder="bestgamer11@mail.com"
                  name="user_email"
                  value={user_email}
                  onChange={e => onChange(e)}
                  aria-required="true"
                  required
                />
                <label htmlFor="user_email" className="form__label">
                  <span className="form__label-name">Email</span>
                </label>
              </div>
            </div>
            <div className="form__section section-two">
              <div className="form__group">
                <input
                  type="text"
                  placeholder="Lastname"
                  name="l_name"
                  value={l_name}
                  onChange={e => onChange(e)}
                />
                <label htmlFor="l_name" className="form__label">
                  <span className="form__label-name">Last Name</span>
                </label>
              </div>
              <div className="form__group">
                <input
                  type="text"
                  placeholder="Firstname"
                  name="f_name"
                  value={f_name}
                  onChange={e => onChange(e)}
                />
                <label htmlFor="f_name" className="form__label">
                  <span className="form__label-name">First Name</span>
                </label>
              </div>
              <div className="form__group">
                <input
                  type="file"
                  accept=".jpeg, .jpg, .png, .gif"
                  placeholder=".jpeg, .jpg, .png, .gif files only"
                  name="user_avatar"
                  className="file-btn-input file-slim"
                  // value={user_avatar}
                  onChange={handleAvatarImageChange}
                />
                <label htmlFor="user_avatar" className="form file-btn-label file-slim">
                  Avatar
                </label>
              </div>
            </div>
          </div>
          <div className="form__group bio-input">
            <label htmlFor="bio" className="form__alt-label">
              <span className="form__label-name--above">Bio</span>
            </label>
            <textarea
              placeholder="A short bio of yourself!"
              name="bio"
              value={bio}
              rows="5"
              onChange={e => onChange(e)}
            ></textarea>
          </div>
          <div className="form__inner-container">
            <div className="form__section">
              <div className="form__group background-img-mrg-sm">
                <input
                  type="file"
                  accept=".jpeg, .jpg, .png, .gif"
                  placeholder=".jpeg, .jpg, .png, .gif files only"
                  name="background_image"
                  className="file-btn-input file-slim"
                  // value={background_image}
                  onChange={handleBackgroundImageChange}
                />
                <label htmlFor="background_image" className="form file-btn-label file-slim">
                  Header
                </label>
              </div>
              <div className="form__group">
                <input
                  aria-required="true"
                  required
                  type="date"
                  name="birthday"
                  value={birthday}
                  onChange={e => onChange(e)}
                  placeholder=" "
                />
                <label htmlFor="birthday" className="form__label">
                  <span className="form__label-name">Birthday</span>
                </label>
              </div>
              <div className="form__group">
                <input                  
                  type="text"
                  name="address"
                  value={address}
                  onChange={e => onChange(e)}
                  placeholder="1234 N. Abby Street"
                />
                <label htmlFor="address" className="form__label">
                  <span className="form__label-name">Address</span>
                </label>
              </div>
              <div className="form__group">
                <input                  
                  type="text"
                  name="address2"
                  value={address2}
                  onChange={e => onChange(e)}
                  placeholder="1111 S. Peach Ave."
                />
                <label htmlFor="address2" className="form__label">
                  <span className="form__label-name">Address 2</span>
                </label>
              </div>
              <div className="form__group">
                <input
                  type="text"
                  name="city"
                  value={city}
                  onChange={e => onChange(e)}
                  placeholder="Jackson"
                />
                <label htmlFor="city" className="form__label">
                  <span className="form__label-name">City</span>
                </label>
              </div>
              <div className="form__group">
                <input
                  type="text"
                  name="state"
                  value={state}
                  onChange={e => onChange(e)}
                  placeholder="Mississippi"
                />
                <label htmlFor="state" className="form__label">
                  <span className="form__label-name">State</span>
                </label>
              </div>
              <div className="form__group">
                <input
                  type="text"
                  name="country"
                  value={country}
                  onChange={e => onChange(e)}
                  placeholder="United States"
                />
                <label htmlFor="country" className="form__label">
                  <span className="form__label-name">Country</span>
                </label>
              </div>
              <div className="form__group">
                <input
                  type="text"
                  name="zipcode"
                  value={zipcode}
                  onChange={e => onChange(e)}
                  placeholder="12345"
                />
                <label htmlFor="zipcode" className="form__label">
                  <span className="form__label-name">Zip Code</span>
                </label>
              </div>
              <div className="form__group">
                <input
                  type="text"
                  name="company"
                  value={company}
                  onChange={e => onChange(e)}
                  placeholder="Workplace Co. Ltd."
                />
                <label htmlFor="company" className="form__label">
                  <span className="form__label-name">Company</span>
                </label>
              </div>
              <div className="form__group">
                <input
                  type="text"
                  placeholder="Biking, Fishing, Mountain Climbing, Swimming, Competitive Boxing"
                  name="interests"
                  value={interests}
                  onChange={e => onChange(e)}
                />
                <label htmlFor="interests" className="form__label">
                  <span className="form__label-name">Interests</span>
                </label>
              </div>
              <div className="form__group select-spacer">
                <select name="gender" value={gender} onChange={e => onChange(e)}>
                  <option> Select Gender</option>
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Other">Other</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>              
              </div>
              <div className="form__group">
                <select name="status" value={status} onChange={e => onChange(e)}>
                  <option> Select Status</option>
                  <option value="Happy">Feeling Happy</option>
                  <option value="Sad">Feeling Sad</option>
                  <option value="Sleepy">Feeling Sleepy</option>
                  <option value="Angry">Feeling Angry</option>
                  <option value="Relaxing">Relaxing</option>
                  <option value="Vacation">On a Vacation</option>
                  <option value="College">Attending College / University</option>
                  <option value="Study">Studying for a test / something important</option>
                  <option value="Instructor">I'm a Teacher</option>
                  <option value="Intern">Interning</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
            <div className="form__section section-two">
              <div className="form__toggle-btn">
                <button type="button" className="btn btn-secondary btn-full-width" onClick={() => toggleSocialInputs(!displaySocialInputs)}>Add Social Network Links <span>(Optional)</span>
                </button>
              </div>
              {displaySocialInputs && (
                <Fragment>
                  <div className="form__group social-input">
                    <input type="text" placeholder="YouTube URL" name="youtube" value={youtube} onChange={e => onChange(e)} />
                    <label htmlFor="youtube" className="form__label">
                      <span className="form__label-name">
                      Youtube URL 
                      </span>
                    </label>
                  </div>
                  <div className="form__group social-input">
                    <input type="text" placeholder="Facebook URL" name="facebook" value={facebook} onChange={e => onChange(e)} />
                    <label htmlFor="facebook" className="form__label">
                      <span className="form__label-name">
                        Facebook URL 
                      </span>
                    </label>
                  </div>
                  <div className="form__group social-input">
                    <input type="text" placeholder="Twitter URL" name="twitter" value={twitter} onChange={e => onChange(e)} />
                    <label htmlFor="twitter" className="form__label">
                      <span className="form__label-name">
                        Twitter URL 
                      </span>
                    </label>
                  </div>
                  <div className="form__group social-input">
                    <input type="text" placeholder="Instagram URL" name="instagram"  value={instagram} onChange={e => onChange(e)} />
                    <label htmlFor="instagram" className="form__label">
                      <span className="form__label-name">
                        Instagram URL 
                      </span>
                    </label>
                  </div>
                  <div className="form__group social-input">
                    <input type="text" placeholder="Linkedin URL" name="linkedin" value={linkedin} onChange={e => onChange(e)} />
                    <label htmlFor="linkedin" className="form__label">
                      <span className="form__label-name">
                        Linkedin URL 
                      </span>
                    </label>
                  </div>
                  <div className="form__group social-input">
                    <input type="text" placeholder="Twitch URL" name="twitch" value={twitch} onChange={e => onChange(e)} />
                    <label htmlFor="twitch" className="form__label">
                      <span className="form__label-name">
                        Twitch URL 
                      </span>
                    </label>
                  </div>
                  <div className="form__group social-input">
                    <input type="text" placeholder="Pinterest URL" name="pinterest" value={pinterest} onChange={e => onChange(e)} />
                    <label htmlFor="pinterest" className="form__label">
                      <span className="form__label-name">
                        Pinterest URL 
                      </span>
                    </label>
                  </div>
                  <div className="form__group social-input">
                    <input type="text" placeholder="Reddit URL" name="reddit" value={reddit} onChange={e => onChange(e)} />
                    <label htmlFor="reddit" className="form__label">
                      <span className="form__label-name">
                        Reddit URL 
                      </span>
                    </label>
                  </div>
                </Fragment>
              )}
            </div>
          </div>
          <div className="form__footer">
            {avatarTypeError || avatarSizeError ||backgroundTypeError || backgroundSizeError ? (
              <div className="form__error">
                File type or size limit exceeded: jpg, jpeg, png, gif only and size must be less than 3mb.
              </div>
            ) : (
              <input type="submit" className="btn btn-primary btn-full-width form__submit" value="Update Profile" />
            )}
            <div className="form__toggle-btn">
              <Link className="btn btn-secondary form__toggle-btn" to="/dashboard">
                Go Back
              </Link>              
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}
export default EditProfile;
