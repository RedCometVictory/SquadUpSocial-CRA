// import normalizeUrl from 'normalize-url';
const normalize = require('normalize-url');
const axios = require('axios');
const jwtGenerator = require('../middleware/jwtGenerator');
const pool = require('../config/db');
const cloudinary = require('cloudinary').v2;

// settings / dashboard, click update btn to put /me
// postman tested and passed*
exports.getProfile = async (req, res, next) => {
  // get complete user profile info from both tables
  const { id } = req.user;
  let myProfileAndSocialsCheck;
  let interestsToArr;
  let interestsArr;
  try {
    // console.log("users table query...");
    const myUserProfile = await pool.query(
      'SELECT id, f_name, l_name, username, tag_name, user_email, user_avatar FROM users WHERE users.id = $1;', [id]
    );

    if (!myUserProfile.rows.length > 0) {
      // maybe redirect to login page
      return res.status(400).json({ errors: [{ msg: "No info found from user." }] });
    }

    // console.log("profiles table query...");
    // for now returns null, may need to actually apply info before testing
    const myProfileInfo = await pool.query(
      'SELECT * FROM profiles WHERE user_id = $1;', [id]
    );

    let profileId = myProfileInfo.rows[0].id;

    // console.log("socials table query...");
    const mySocialsInfo = await pool.query(
      'SELECT * FROM socials WHERE profile_id = $1;', [profileId]
    );
    
    // myUserProfile.rows[0].user_password = undefined;
    // interestsToString = myProfileInfo.rows[0].interests;
    // console.log("interestsToArr......");
    interestsToArr = myProfileInfo.rows[0].interests;
    // console.log(interestsToArr);
    if (interestsToArr && typeof interestsToArr === "string") {
      interestsArr = interestsToArr.split(',').map(interest => '' + interest.trim());
      myProfileInfo.rows[0].interests = interestsArr;
    }
    // Array.isArray(interests) ? interestsToString = interests.join(", ") : interestsToString = interests;

    let birth_date = myProfileInfo.rows[0].birth_date;
    let date = birth_date.toISOString().slice(0, 10); //*
    myProfileInfo.rows[0].birth_date = date;
    
    const getFollowers = await pool.query(
      'SELECT id, username, tag_name, user_avatar FROM users JOIN follows AS F ON F.follower_id = users.id WHERE F.following_id = $1;', [id]
    );

    const getFollowing = await pool.query(
      'SELECT id, username, tag_name, user_avatar FROM users JOIN follows AS F ON F.following_id = users.id WHERE F.follower_id = $1;', [id]
    );
    // send existing profile to matched user
    res.status(200).json({
      status: "Success! Generated user profile for editing.",
      data: {
        myUserData: myUserProfile.rows[0],
        myProfileInfo: myProfileInfo.rows[0],
        mySocialsInfo: mySocialsInfo.rows[0],
        profileFollowers: getFollowers.rows,
        profileFollowing: getFollowing.rows
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error...");
  }
}

// postman tested and passed
exports.getAllProfiles = async (req, res, next) => {
  // need to limit via pagination
  try {
    const userProfiles = await pool.query(
      'SELECT id, username, tag_name, user_avatar FROM users;'
    );
    // if (!userProfiles.rows.length > 0) {
    // if (userProfiles.rows.length !== 0) {
    //   return res.status(400).json({ errors: [{ msg: "Could not get any profiles." }] });
    // }
    res.status(200).json({
      status: "Success! Listing all user profiles!",
      data: {
        profiles: userProfiles.rows
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error...");
  }
}

// postman tested and passed*
exports.getProfileById = async (req, res, next) => {
  let interestsToArr;
  let interestsArr;
  //  search for user when clicking their name in the users/members list, in the frontend - if the user is loggged in, then a edit button appears by their profile image (only)
  const { user_id } = req.params;
  // const { id } = req.user;  // not necessary unless access to edit profile by id
  let userFollowingProfileStatus;
  let profileId;
  let profileSocial;
  let profileById;
  let profileSocialsById;

  try {
    // get user profile and socials
    // join with socials, base on profile.user_id
    const userData = await pool.query(
      'SELECT id, f_name, l_name, username, tag_name, user_email, user_avatar FROM users WHERE users.id = $1;', [user_id]
      // 'SELECT U.id, U.username, U.tag_name, U.user_avatar, P.id FROM users AS U JOIN profiles AS P ON U.id = P.user_id WHERE U.id = $1;', [user_id]
    );

    const profile = await pool.query(
      'SELECT * FROM profiles WHERE user_id = $1;', [user_id]
    );

    if (profile.rows[0] === undefined) {
      // console.log("no profile info found");
      profileId = undefined;
      profileSocial = undefined;
    }
    if (profile.rows[0] !== undefined) {
      // console.log("profile data has been found");
      // console.log("interestsToArr......");
      interestsToArr = profile.rows[0].interests;
      // console.log(interestsToArr);
      if (interestsToArr && typeof interestsToArr === "string") {
        interestsArr = interestsToArr.split(',').map(interest => '' + interest.trim());
        // split string to string array
        profile.rows[0].interests = interestsArr;
      }
      profileId = profile.rows[0];
      // apply the following fix to this profile query
      let birth_date = profile.rows[0].birth_date;
      let date = birth_date.toISOString().slice(0, 10);
      profile.rows[0].birth_date = date;
    }
    
    if (profileId !== undefined) {
      profileSocial = await pool.query(
        'SELECT youtube_url, facebook_url, twitter_url, instagram_url, linkedin_url, twitch_url, pinterest_url, reddit_url FROM socials WHERE profile_id = $1;', [profileId.id]
      );
    }

    profileById = profileId;
    if (profileSocial === undefined) {
      profileSocialsById = profileSocial;
    }
    if (profileSocial !== undefined) {
      profileSocialsById = profileSocial.rows[0];
    }

    // group by 1 means order data (rows) by the first column
    const getProfilePosts = await pool.query(
      'SELECT P.id, P.title, P.image_url, P.description, COUNT(DISTINCT L.id) AS postLikes, COUNT(DISTINCT C.id) AS postComments FROM posts AS P LEFT JOIN likes AS L ON L.post_like = P.id LEFT JOIN comments AS C ON C.post_id = P.id WHERE P.user_id = $1 GROUP BY P.id;', [user_id]
    );
    
    // display number of users who follow you
    const getFollowers = await pool.query(
      // "SELECT follower_id FROM follows WHERE following_id = $1;", [user_id]
      "SELECT * FROM follows WHERE following_id = $1;", [user_id]
    );

    const getFollowing = await pool.query(
      // "SELECT following_id FROM follows WHERE follower_id = $1;", [user_id]
      "SELECT * FROM follows WHERE follower_id = $1;", [user_id]
    );
    // check if current user is following profile by id, returns boolean value
    res.status(200).json({
      status: "Success! Here's a user profile.",
      data: {
        myUserData: userData.rows[0],
        myProfileInfo: profileById, // profile.rows[0],
        mySocialsInfo: profileSocialsById, // profileSocial.rows[0],
        profilePosts: getProfilePosts.rows,
        profileFollowers: getFollowers.rows,
        profileFollowing: getFollowing.rows
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error...");
  }
};

exports.allFollowersProfiles = async (req, res, next) => {
  const { id } = req.user;
  try {
    // get all users following you
    const allUsersFollowingMe = await pool.query(
      'SELECT username, tag_name, user_avatar FROM users JOIN follows AS F ON F.follower_id = users.id WHERE F.following_id = $1;', [id]
    );
    res.status(200).json({
      status: "Listing all users following you.",
      data : {
        followers: allUsersFollowingMe.rows
      }
    })
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error...");
  }
};

// postman tested and passed
exports.allFollowedProfiles = async (req, res, next) => {
  const { id } = req.user;
  try {
    // all ppl u follow
    const allFollowedByUser = await pool.query(
      'SELECT username, tag_name, user_avatar FROM users JOIN follows AS F ON F.following_id = users.id WHERE F.follower_id = $1;', [id]
    );
    res.status(200).json({
      status: "Showing all users currently followed!",
      data: {
        following: allFollowedByUser.rows
      }
    })
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error...");
  }
}

// postman tested and passed*
exports.followProfile = async (req, res, next) => {
  const { id } = req.user;
  const { user_id } = req.params; // the follow button
  // perhaps take the id of the user profile that you visit (req.params.user_id) and place it as the following_if value  const // following id of the other user,...{}
  // very similar to how the like post component will work
  try {
    // check if already following:
    const checkIfFollowed = await pool.query(
      'SELECT * FROM follows WHERE following_id = $1 AND follower_id = $2;', [user_id, id]
    );
    if (checkIfFollowed.rows.length > 0) {
      return res.status(400).json({ errors: [{ msg: "User is already followed." }] });
    }
    const followUserProfile = await pool.query(
      "INSERT INTO follows (following_id, follower_id) VALUES ($1, $2) RETURNING *;", [user_id, id]
    );
    if(!followUserProfile.rows.length > 0) {
      return res.status(400).json({ errors: [{ msg: "Failed to follow." }] });
    }
    res.status(200).json({
      status: "Successful follow attempt!",
      data: {
        followUser: followUserProfile.rows
      }
    })
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error...");
  }
}

// postman tested and passed*
exports.createProfile = async (req, res, next) => {
  // JSON.stringify(req.body); 
  // user info - values from profile & socials form data
  const { id } = req.user;
  let {
    address,
    address2,
    city,
    state,
    country,
    zipcode,
    gender,
    birthday,
    company,
    status,
    interests, // ensure this is an arr
    bio,
    youtube,
    facebook,
    twitter,
    instagram,
    linkedin,
    twitch,
    pinterest,
    reddit
  } = req.body;

  // const { path, filename } = req.file;
  // background_image via req.file
  let backgroundUrl = '';
  let backgroundFilename = '';
  let interestsToString;
  let interestsToArr;
  let interestsArr;
  let profileDataCheck;
  
  if (birthday === "" || !birthday) {
    return res.status(400).json({ errors: [{ msg: "Include a birthdate for your profile." }] });
  }

  profileDataCheck = {
    address, address2, city, state, country,
    zipcode, gender, birthday, company, status, interests, bio
  }
  
  for (const [key, value] of Object.entries(profileDataCheck)) {
    if (!value) {
      profileDataCheck[key] = ''; // console.log(value);
    }
  }

  // if entered as array convert to string
  // Array.isArray(interests) ? interestsToString = interests.join(", ") : interestsToString = interests
  
  // console.log(typeof interestsToString + " " + interestsToString)
  // get the socials, set as object for normalize
  const socials = {
    youtube, facebook, twitter, instagram, linkedin, twitch, pinterest, reddit
  };
  
  // console.log("socials data...");
  // console.dir(socials);
  for (const [key, value] of Object.entries(socials)) {
    if (!value) {
      socials[key] = ''; // console.log(value);
    }
  }
  // looks like mornalize package only converts data as objects...
  for (const [key, value] of Object.entries(socials)) {
    if (value && value.length > 0) {
      socials[key] = normalize(value, { forceHttps: true });
      // console.log(value);
    }
  }
  // console.dir(socials);
  // convert normalized results into arr
  // convert object into arr, take values only, ignore keys
  const profileChecked = Object.values(profileDataCheck);
  const socialsArr = Object.values(socials);
  
  [addressChk, address2Chk, cityChk, stateChk, countryChk, zipcodeChk, genderChk, birthdayChk, companyChk, statusChk, interestsChk, bioChk] = profileChecked;
  
  [youtubeNorm, facebookNorm, twitterNorm, instagramNorm, linkedinNorm, twitchNorm, pinterestNorm, redditNorm] = socialsArr;

  Array.isArray(interestsChk) ? interestsToString = interestsChk.join(", ") : interestsToString = interestsChk;

  try {
    if (req.file && req.file.path) {
      backgroundUrl = req.file.path;
      backgroundFilename = req.file.filename;
    }
    if (backgroundUrl.startsWith('dist\\')) {
      let editBackgroundUrl = backgroundUrl.slice(4);
      backgroundUrl = editBackgroundUrl;
    }
    // check if user profile already exists
    const userProfileExists = await pool.query(
      'SELECT * FROM profiles WHERE user_id = $1;', [id]
    );
      
    if(userProfileExists.rows.length > 0) {
      return res.status(403).json({ errors: [{ msg: "Unauthorized. Profile already exists." }] });
    }

    // create porfile - profile fk connect to users id
    const createProfile = await pool.query(
      'INSERT INTO profiles (address, address_2, city, state, country, zipcode, gender, birth_date, company, status, interests, bio, background_image, background_image_filename, user_id) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING *;', [addressChk, address2Chk, cityChk, stateChk, countryChk, zipcodeChk, genderChk, birthdayChk, companyChk, statusChk, interestsToString, bioChk, backgroundUrl, backgroundFilename, id]
    );

    if (!createProfile.rows.length > 0) {
      return res.status(400).json({ errors: [{ msg: "No profile was created." }] });
    }
        
    // console.log("interestsToArr......");
    interestsToArr = createProfile.rows[0].interests;
    // console.log(interestsToArr);
    if (typeof interestsToArr === "string") {
      interestsArr = interestsToArr.split(',').map(interest => '' + interest.trim());
    }
    // console.log("response converting string to array");
    // console.log(interestsArr);
    createProfile.rows[0].interests = interestsArr;
        
    // relate socials to profile:
    profile_id = createProfile.rows[0].id;
    // create socials - socials fk connect to profile id
    const profileSocials = await pool.query(
      'INSERT INTO socials (youtube_url, facebook_url, twitter_url, instagram_url, linkedin_url, twitch_url, pinterest_url, reddit_url, profile_id) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *;', [youtubeNorm, facebookNorm, twitterNorm, instagramNorm, linkedinNorm, twitchNorm, pinterestNorm, redditNorm, profile_id]
    );

    res.status(200).json({
      status: "Success! User profile and socials have been created!",
      data: {
        myProfileInfo: createProfile.rows[0],
        mySocialsInfo: profileSocials.rows[0]
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error...");
  }

}

// postman tested and passed*
exports.editProfile = async (req, res, next) => {
  // user info - values from profile form data
  const { id } = req.user;
  let {
    f_name,
    l_name,
    username,
    tag_name,
    user_email,
    address,
    address2,
    city,
    state,
    country,
    zipcode,
    gender,
    birthday, // required
    company,
    status,
    interests,
    bio, 
    youtube,
    facebook,
    twitter,
    instagram,
    linkedin,
    twitch,
    pinterest,
    reddit
  } = req.body;

  let avatarUrl = '';
  let avatarFilename = '';
  let backgroundUrl = '';
  let backgroundFilename = '';
  let usersDataUpdate;
  let profileUpdate;
  let userDataCheck;
  let profileDataCheck;
  let interestsToString;
  let interestsToArr;
  let interestsArr;
  let prefixedTagName;
  // let defaultAvatar = "https://upload.wikimedia.org/wikipedia/commons/7/72/Default-welcomer.png";
  let confirmedAvatar;

  if (birthday === "" || !birthday) {
    return res.status(400).json({ errors: [{ msg: "Include a birthdate for your profile." }] });
  }
  userDataCheck = {
    f_name, l_name, username, tag_name, user_email
  }
  profileDataCheck = {
    address, address2, city, state, country,
    zipcode, gender, birthday, company, status, interests, bio
  }
  
  for (const [key, value] of Object.entries(userDataCheck)) {
    if (!value) {
      userDataCheck[key] = ''; // console.log(value);
    }
  }
  
  for (const [key, value] of Object.entries(profileDataCheck)) {
    if (!value) {
      profileDataCheck[key] = ''; // console.log(value);
    }
  }

  // console.log("start: " + typeof interests + " " + interests);
  // if entered as array convert to string
  // Array.isArray(interests) ? interestsToString = interests.join(", ") : interestsToString = interests;

  // get the socials, turn into array, normalize
  const socials = {
    youtube, facebook, twitter, instagram, linkedin, twitch, pinterest, reddit
  };

  // console.log("socials data...");
  // console.dir(socials);
  for (const [key, value] of Object.entries(socials)) {
    if (!value) {
      socials[key] = '';
      // console.log(value);
    }
  }

  // normalize seems to not work with arrays thus only objects...
  for (const [key, value] of Object.entries(socials)) {
    if (value && value.length > 0) {
      socials[key] = normalize(value, { forceHttps: true });
      // console.log(value);
    }
  }
  // convert object into arr, take values only, ignore keys
  // console.dir(socials);
  const userChecked = Object.values(userDataCheck);
  const profileChecked = Object.values(profileDataCheck);
  const socialsArr = Object.values(socials);

  [f_nameChk, l_nameChk, usernameChk, tag_nameChk, user_emailChk] = userChecked;

  [addressChk, address2Chk, cityChk, stateChk, countryChk, zipcodeChk, genderChk, birthdayChk, companyChk, statusChk, interestsChk, bioChk] = profileChecked;

  [youtubeNorm, facebookNorm, twitterNorm, instagramNorm, linkedinNorm, twitchNorm, pinterestNorm, redditNorm] = socialsArr;
  
  // check if tagName is string
  if (typeof tag_nameChk !== 'string') {
    tag_nameChk.toString();
  }
  if (typeof tag_nameChk === 'string') {
    // repalce all white spaces in string with _
    let editedTagName = tag_nameChk.split(' ').join('_');
    
    // check if first char is '@'
    if (editedTagName.charAt(0) !== '@') {
      let prefix = '@';
      prefixedTagName = prefix + editedTagName;
    }
    if (editedTagName.charAt(0) === '@') {
      prefixedTagName = editedTagName;
    }
  }
  
  if (req.files) {
    if (req.files['user_avatar']) {
      avatarUrl = req.files['user_avatar'][0]['path'];
      avatarFilename = req.files['user_avatar'][0]['filename'];
    }
    if (req.files['background_image']) {
      backgroundUrl = req.files['background_image'][0]['path'];
      backgroundFilename = req.files['background_image'][0]['filename'];
    }
  }

  if (avatarUrl.startsWith('dist\\')) {
    let editAvatarUrl = avatarUrl.slice(4);
    avatarUrl = editAvatarUrl;
  }
  if (backgroundUrl.startsWith('dist\\')) {
    let editBackgroundUrl = backgroundUrl.slice(4);
    backgroundUrl = editBackgroundUrl;
  }
  
  Array.isArray(interestsChk) ? interestsToString = interestsChk.join(", ") : interestsToString = interestsChk;

  try {
    // report error if not proper values
    if (!usernameChk) {
      return res.status(400).json({ errors: [{ msg: 'A username is required!' }] });
    }
    if (prefixedTagName.length <= 1 || !prefixedTagName) {
      return res.status(400).json({ errors: [{ msg: 'A tag name is required!' }] });
    }
    if (!user_emailChk) {
      return res.status(400).json({ errors: [{ msg: 'A user email is required!' }] });
    }
    
    // check for duplicate username, tag name, or email
    let emailResult = await pool.query('SELECT user_email, id FROM users WHERE user_email = $1', [ user_emailChk ]);
    let usernameResult = await pool.query('SELECT username, id FROM users WHERE username = $1', [ usernameChk ]);
    let tagNameResult = await pool.query('SELECT tag_name, id FROM users WHERE tag_name = $1', [ prefixedTagName ]);

    // if (user.rowCount !== 0) {
    if (usernameResult.rowCount !== 0 && usernameResult.rows[0].id !== id) {
      return res.status(400).json({ errors: [{ msg: 'The username already exists!' }] });
    }

    if (tagNameResult.rowCount !== 0 && tagNameResult.rows[0].id !== id) {
      return res.status(400).json({ errors: [{ msg: 'The tag name already exists!' }] });
    }

    if (emailResult.rowCount !== 0 && emailResult.rows[0].id !== id) {
      return res.status(400).json({ errors: [{ msg: 'The user already exists!' }] });
    }

    // cloudinary update user avatar if new onw exists
    if (avatarUrl !== '') {
      if (avatarFilename !== '') {
        let currImageFilename = await pool.query(
          'SELECT user_avatar_filename FROM users WHERE id = $1;', [id]
        );

        if (currImageFilename.rows[0].user_avatar_filename) {
          await cloudinary.uploader.destroy(currImageFilename.rows[0].user_avatar_filename);
        }
      }
    
      usersDataUpdate = await pool.query(
        'UPDATE users SET f_name = $1, l_name = $2, username = $3, tag_name = $4, user_email = $5, user_avatar = $6, user_avatar_filename = $7 WHERE id = $8 RETURNING *;', [f_nameChk, l_nameChk, usernameChk, prefixedTagName, user_emailChk, avatarUrl, avatarFilename, id]
      );
    }
    if (avatarUrl === '') {
      usersDataUpdate = await pool.query(
        'UPDATE users SET f_name = $1, l_name = $2, username = $3, tag_name = $4, user_email = $5 WHERE id = $6 RETURNING *;', [f_nameChk, l_nameChk, usernameChk, prefixedTagName, user_emailChk, id]
      );
    }

    // ***Update avatar url, includes avatar used for all posts and comments. As the avatar is being replaced it must be destroyed from cloudinary, same goes for any image that is updated or replaced.

    if (!usersDataUpdate.rows.length > 0) {
      return res.status(400).json({ errors: [{ msg: "User data failed to update." }] });
    }
    const checkForProfile = await pool.query(
      'SELECT * FROM profiles WHERE user_id = $1;', [id]
    );
    if (!checkForProfile.rows.length > 0) {
      return res.status(404).json({ errors: [{ msg: "No profile data exists. Create a profile in order to edit." }] });
    }
    if (backgroundUrl !== '') {
      if (backgroundFilename !== '') {
        let currImageFilename = await pool.query(
          'SELECT background_image_filename FROM profiles WHERE user_id = $1;', [id]
        );
        // console.log('updating background image in cloudinary');
        if (currImageFilename.rows[0].background_image_filename) {
          await cloudinary.uploader.destroy(currImageFilename.rows[0].background_image_filename);
        }
      }
      // console.log("background image, updating profile")
      profileUpdate = await pool.query(
        'UPDATE profiles SET address = $1, address_2 = $2, city = $3, state = $4, country = $5, zipcode = $6, gender = $7, birth_date = $8, company = $9, status = $10, interests = $11, bio = $12, background_image = $13, background_image_filename = $14 WHERE user_id = $15 RETURNING *;', [addressChk, address2Chk, cityChk, stateChk, countryChk, zipcodeChk, genderChk, birthdayChk, companyChk, statusChk, interestsToString, bioChk, backgroundUrl, backgroundFilename, id]
      );
    }
    if (backgroundUrl === '') {
      // console.log("no background image, updating profile")
      profileUpdate = await pool.query(
        'UPDATE profiles SET address = $1, address_2 = $2, city = $3, state = $4, country = $5, zipcode = $6, gender = $7, birth_date = $8, company = $9, status = $10, interests = $11, bio = $12 WHERE user_id = $13 RETURNING *;', [addressChk, address2Chk, cityChk, stateChk, countryChk, zipcodeChk, genderChk, birthdayChk, companyChk, statusChk, interestsToString, bioChk, id]
      );
    }

    // console.log(profileUpdate.rows);
    if (!profileUpdate.rows.length > 0) {
      return res.status(400).json({ errors: [{ msg: "Could not update profile." }] });
    }

    // console.log("interestsToArr......");
    interestsToArr = profileUpdate.rows[0].interests;
    // console.log(interestsToArr);
    if (interestsToArr && typeof interestsToArr === "string") {
      interestsArr = interestsToArr.split(',').map(interest => '' + interest.trim());
      profileUpdate.rows[0].interests = interestsArr;
    }
    // console.log("response converting string to array");
    // console.log(interestsArr);
    
    const profileUpdateId = profileUpdate.rows[0].id;

    const socialsUpdate = await pool.query(
      'UPDATE socials SET youtube_url = $1, facebook_url = $2, twitter_url = $3, instagram_url = $4, linkedin_url = $5, twitch_url = $6, pinterest_url = $7, reddit_url = $8 WHERE profile_id = $9 RETURNING *;', [youtubeNorm, facebookNorm, twitterNorm, instagramNorm, linkedinNorm, twitchNorm, pinterestNorm, redditNorm, profileUpdateId]
    );

    usersDataUpdate.rows[0].user_password = undefined;
    res.status(200).json({
      status: "Success! Profile updated.",
      data: {
        myUserData: usersDataUpdate.rows[0],
        myProfileInfo: profileUpdate.rows[0],
        mySocialsInfo: socialsUpdate.rows[0]
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error...");
  }
}

// postman tested passed
exports.deleteProfile = async (req, res, next) => {
  const { id } = req.user;
  try {    
    //* Foreign keys create constraints that prevent us from deleting parent tables right away, thus delete all child tables (that have foreign keys) first, or give foreign keys null values, then delete parent tables last, another option is to use ON DELETE CASCADE, which seems to do this process automatically but it may lead to errors?

    const deleteCommentImages = await pool.query(
      'SELECT image_url_filename FROM comments WHERE user_id = $1;', [id]
    );

    if (deleteCommentImages.rows.length > 0) {
      let promises = [];
      for (let i = 0; i < deleteCommentImages.rows.length; i++) {
        if (deleteCommentImages.rows[i].image_url_filename !== '') {
          promises.push(cloudinary.uploader.destroy(deleteCommentImages.rows[i].image_url_filename));
        }
      }
      await Promise.all(promises);
    };

    const deletePostImages = await pool.query(
      'SELECT image_url_filename FROM posts WHERE user_id = $1;', [id]
    );

    if (deletePostImages.rows.length > 0) {
      let promises = [];
      for (let i = 0; i < deletePostImages.rows.length; i++) {
        if (deletePostImages.rows[i].image_url_filename !== '') {
          promises.push(cloudinary.uploader.destroy(deletePostImages.rows[i].image_url_filename));
        }
      }
      await Promise.all(promises);
    };

    let backgroundImageFilename = await pool.query(
      'SELECT background_image_filename FROM profiles WHERE user_id = $1;', [id]
    );
    if (backgroundImageFilename.rows[0].background_image_filename) {
      await cloudinary.uploader.destroy(backgroundImageFilename.rows[0].background_image_filename);
    }
    
    let avatarImageFilename = await pool.query(
      'SELECT user_avatar_filename FROM users WHERE id = $1;', [id]
    );
    if (avatarImageFilename.rows[0].user_avatar_filename) {
      await cloudinary.uploader.destroy(avatarImageFilename.rows[0].user_avatar_filename);
    }

    const deleteAllComments = await pool.query('DELETE FROM comments WHERE user_id = $1;', [id]);
    const deleteAllPosts = await pool.query('DELETE FROM posts WHERE user_id = $1;', [id]);
    const deleteAllFollows = await pool.query('DELETE FROM follows WHERE follower_id = $1', [id]);

    // erase yourself from others following lists
    const deleteBeingFollowed = await pool.query('DELETE FROM follows WHERE following_id = $1;', [id]);

    // delete from likes
    const deleteFromLikes = await pool.query('DELETE FROM likes WHERE user_id = $1', [id]);
    const profileId = await pool.query('SELECT profiles.id FROM profiles WHERE profiles.user_id = $1', [id]);

    if (profileId.rows[0]) {
      const deleteAllSocials = await pool.query('DELETE FROM socials WHERE profile_id = $1', [profileId.rows[0].id]);
      
      // delete all user profile data
      const deleteProfile = await pool.query('DELETE FROM profiles WHERE user_id = $1;', [id]);
    }

    // delete user account // deleteUsersTable(id);
    const deleteUser = await pool.query('DELETE FROM users WHERE id = $1;', [id]);

    return res.status(200).json({ msg: "User and associated data has been deleted." });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error...");
  }
}

// postman tested and passed
exports.unfollowProfile = async (req, res, next) => {
  const { id } = req.user;
  const { user_id }  = req.params;
  try {
    // check if already unfollowed
    const checkIfFollowed = await pool.query(
      'SELECT * FROM follows WHERE following_id = $1 AND follower_id = $2;', [user_id, id]
    );
    if (checkIfFollowed.rows.length === 0) {
      return res.status(400).json({ errors: [{ msg: "User is not followed yet." }] });
    }
    const unfollowUserProfile = await pool.query(
      'DELETE FROM follows WHERE following_id = $1 AND follower_id = $2;', [user_id, id]
    );
    if(unfollowUserProfile.rows.length > 0) {
      return res.status(400).json({ errors: [{ msg: "Failed to remove follow." }] });
    }
    const remainingProfileFollowers = await pool.query(
      'SELECT * FROM follows WHERE following_id = $1 AND follower_id = $2;', [user_id, id]
    );
    res.status(200).json({
      status: "Success! You have unfollowed.",
      data: {
        followUser: id
      }
    })
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error...");
  }
}