require('dotenv').config();
const bcrypt = require('bcryptjs');
const {accessTokenGenerator} = require('../middleware/jwtGenerator');
const pool = require('../config/db');

// Register User - passed postman
exports.registerUser = async (req, res, next) => {
  // req.file produced by multer after uploading to cloudinary
  // path = secure_url / filename = public_id
  let { firstName, lastName, username, tagName, email, password } = req.body;
  let prefixedTagName;
  let defaultAvatar = `https://res.cloudinary.com/${process.env.CLDNAME}/image/upload/v1621492034/social-uploads/Default-welcomer_zvjurb.png`;
  let confirmedAvatar = defaultAvatar;
  let confirmedAvatarFilename = '';

  if (!firstName) {
    firstName = '';
  }
  if (!lastName) {
    lastName = '';
  }

  try {
    if (req.file && req.file.path) {
      if (req.file.path) {
        confirmedAvatar = req.file.path;
        confirmedAvatarFilename = req.file.filename;
      }
    }
    if (confirmedAvatar.startsWith('dist\\')) {
      let editAvatarUrl = confirmedAvatar.slice(4);
      confirmedAvatar = editAvatarUrl;
    }

    // check if tagName is string
    if (typeof tagName !== 'string') {
      tagName.toString();
    }
    if (typeof tagName === 'string') {
      // repalce all white spaces in string with _
      let editedTagName = tagName.split(' ').join('_');
      
      // check if first char is '@'
      if (editedTagName.charAt(0) !== '@') {
        let prefix = '@';
        prefixedTagName = prefix + editedTagName;
      }
      if (editedTagName.charAt(0) === '@') {
        prefixedTagName = editedTagName;
      }
    }

    // check if client provided info is not already present in db, to prevent repeated info
    let emailResult = await pool.query('SELECT user_email FROM users WHERE user_email = $1', [ email ]);
    let usernameResult = await pool.query('SELECT username FROM users WHERE username = $1', [ username ]);
    let tagNameResult = await pool.query('SELECT tag_name FROM users WHERE tag_name = $1', [ prefixedTagName ]);

    // if (user.rowCount !== 0) {
    if (usernameResult.rowCount !== 0) {
      return res.status(400).json({ errors: [{ msg: 'The username already exists!' }] });
    }
    if (tagNameResult.rowCount !== 0) {
      return res.status(400).json({ errors: [{ msg: 'The tag name already exists!' }] });
    }
    if (emailResult.rowCount !== 0) {
      return res.status(400).json({ errors: [{ msg: 'The user already exists!' }] });
    }
    // Generate new user - encrypt password
    const salt = await bcrypt.genSalt(11);
    // not storing as a obj, but in psqldb
    const encryptedPassword = await bcrypt.hash(password, salt);

    // Insert new registered user to table:
    // avatar created later after login process...
    let newUser = await pool.query(
      'INSERT INTO users (f_name, l_name, username, tag_name, user_email, user_password, user_avatar, user_avatar_filename) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *', [firstName, lastName, username, prefixedTagName, email, encryptedPassword, confirmedAvatar, confirmedAvatarFilename]
    );

    const jwtToken = accessTokenGenerator(newUser.rows[0].id);
    
    // hide token from client (already added to db)
    // newUser.rows[0].user_password = undefined;
    // return access jetToken to client, so that they may use it to login right away
    res.status(200).json({ 
      status: "Success! Account created.",
      data: {
        token: jwtToken
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error...');
  }
};