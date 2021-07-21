import React, { useState, useRef, Fragment } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { createProfile } from '../../../redux/actions/profileActions';
// each form input counts as a piece of state, useState ensures inputs and forms work properly. useState consists of two values in an array. the first being the instance of state & the second being the function used to interact w/the state.
// execute createProfile upon submit - { history }, call to access the history via props.history
// upon submit alert should generate due to backend requirements, via the profile action 
const initialState = {
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

const CreateProfile = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const fileInputText = useRef();
  const [formProfileData, setFormProfileData] = useState(initialState);
  // toggle adding social media links, button used for onclick, pass opposite value of current bool state, false to true - true to false
  const [displaySocialInputs, toggleSocialInputs] = useState(false);
  // use useState keys as variables, destructure from formData
  // ***** Validate File Type *****
  const [fileTypeError, setFileTypeError] = useState(false);
  // ***** Validate File Size *****
  const [fileSizeError, setFileSizeError] = useState(false);

  const {
    address, address2,
    city, state,
    country, zipcode,
    gender, birthday,
    company, status,
    interests, // ensure this is an arr
    bio, // background_image, // not used
    youtube, facebook,
    twitter, instagram,
    linkedin, twitch,
    pinterest, reddit
  } = formProfileData;

  // inputs have onchange - whatever is placed in the input value will be placed into the state. all inputs place a value attribute that equals the value of the keyname found in the state
  const onChange = e => setFormProfileData({ ...formProfileData, [e.target.name]: e.target.value });
  const handleBackgroundImageChange = (e) => {
    // setBackgroundImage(e.target.files[0]);
    // check file type
    let fileToUpload = e.target.files[0];
    checkFileType(fileToUpload);
    // check file size
    checkFileSize(fileToUpload);
    setFormProfileData({
      ...formProfileData,
      [e.target.name]: e.target.files[0]
    })
  };
  const onSubmit = e => {
    e.preventDefault();
    dispatch(createProfile(formProfileData, history));
    // dispatch(createProfile({...formData, ...backgroundImage}, history));
  }
  // ********* Check File Size and Type ***********
  // check file type
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
  // ****************************************

  return (
    <section className="form-page-wrapper">
      <h2>Create Profile</h2>
      <p><i className="fas fa-user"></i> Providing information makes your profile stand out from the others.</p>
      <div className="form-container">
        <form className="form" onSubmit={onSubmit}>
          <small className="form__header">Red labels are <span className="req-color">required</span>.</small>
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
                  onChange={handleBackgroundImageChange}
                  ref={fileInputText}
                />
                <label htmlFor="background_image" className="form file-btn-label file-slim">
                  Profile
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
            {fileTypeError || fileSizeError ? (
              <div className="form__error">
                File type or size limit exceeded: jpg, jpeg, png, gif only and size must be less than 3mb.
              </div>
            ) : (
              <input type="submit" className="btn btn-primary btn-full-width form__submit" value="Create Profile" />
            )}
            <div className="form__toggle-btn">
              <Link className="btn btn-secondary no-side-margin form__toggle-btn" to="/dashboard">
                Go Back
              </Link>              
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}
export default CreateProfile;