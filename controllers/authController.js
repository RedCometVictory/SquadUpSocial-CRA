require('dotenv').config();
const bcrypt = require('bcryptjs');
const pool = require('../config/db');
const { refreshTokenString, accessTokenGenerator, refreshTokenGenerator, getAccessTokenFromHeaders, validateRefreshToken, refreshTokenCookieOptions } = require('../middleware/jwtGenerator');

exports.authDemo = async (req, res, next) => {
  let email = process.env.DEMO_EMAIL;
  let password = process.env.DEMO_PASSWORD;

  try {
    const user = await pool.query(
      'SELECT * FROM users WHERE user_email = $1', [email]
    );
    if (user.rows.length === 0) {
      return res.status(400).json({ errors: [{ msg: "Invalid email or password."}] })
    }

    const isMatch = await bcrypt.compare(
      password, user.rows[0].user_password
    );

    if (!isMatch) {
      return res.status(400).json({ errors: [{ msg: "Invalid email or password."}] });
    }

    const jwtToken = accessTokenGenerator(user.rows[0].id);
    const refreshToken = refreshTokenString();

    const setRefreshToken = await pool.query(
      'UPDATE users SET refresh_token = $1 WHERE user_email = $2 RETURNING *;', [refreshToken, user.rows[0].user_email]
    );

    if (!setRefreshToken.rows.length > 0) {
      return res.status(403).json({ errors: [{ msg: "Unauthorized. Failed to update refresh token." }] });
    };

    const signedRefreshToken = refreshTokenGenerator(refreshToken);

    const refreshOptions = refreshTokenCookieOptions();
    res.cookie('refresh', signedRefreshToken, refreshOptions);

    return res.json({
      status: "Successful login!",
      data: {
        token: jwtToken
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error...");
  }
}

// postman test passed; place new access token (when refreshing tokens occurs) in req header bearer - that way continued access to restricted routes continues...
// test route - get user via LoadUser action
// req.user via token (authJWT)
// used to access user id via state.auth.user.id
exports.authTest = async (req, res, next) => {
  const { id } = req.user; // passed via header
  try {
    // select all but password
    const user = await pool.query(
      'SELECT * FROM users WHERE id = $1', [id]
    );
    if (!user.rows[0] > 0) {
      return res.status(403).json({ errors: [{ msg: "Unauthorized. Failed to get user data." }] });
    }
    // do not send the password to the client
    user.rows[0].user_password = undefined;
    
    res.status(200).json({
      success: "Test successful!",
      data: {
        user: user.rows[0]
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error!');
  }
};

// login user - successfully passed postman
exports.authValidToken = async (req, res, next) => {
  const { email, password } = req.body; // user pswr, not hashpswrd
  try {
    const user = await pool.query(
      'SELECT * FROM users WHERE user_email = $1', [email]
    );
    // if no user - nothing returned...
    if (user.rows.length === 0) {
      return res.status(400).json({ errors: [{ msg: "Invalid email or password."}] })
    }

    const isMatch = await bcrypt.compare(
      password, user.rows[0].user_password
    );

    if (!isMatch) {
      return res.status(400).json({ errors: [{ msg: "Invalid email or password."}] });
    }

    // create access and refresh token, store both in cookies, save refToken to db
    const jwtToken = accessTokenGenerator(user.rows[0].id);
    // const refreshToken = refreshTokenGenerator(user.rows[0].id);
    // create refresh token "id", store into the db of the user
    const refreshToken = refreshTokenString();
    
    // set refresh to db, this is for later matching the token from the cookie to the reftoken stored in the db, if matched create new ref token and save it to do, if no match, logout user (ultimately setting this value to null) also clear the reftoken cookie
    const setRefreshToken = await pool.query(
      'UPDATE users SET refresh_token = $1 WHERE user_email = $2 RETURNING *;', [refreshToken, user.rows[0].user_email]
    );

    if (!setRefreshToken.rows.length > 0) {
      // return res.json({ msg: "Refresh Failed to update."})
      return res.status(403).json({ errors: [{ msg: "Unauthorized. Failed to update refresh token." }] });
    };

    // sign reftoken id, put into cookie, verify upon /refresh-token
    const signedRefreshToken = refreshTokenGenerator(refreshToken);

    const refreshOptions = refreshTokenCookieOptions();
    // const refreshOptions = {
      // expires: new Date(Date.now() + 120*1000), // 120sec
      // expires: new Date(Date.now() + 7*24*60*60*1000), //7d
      // secure: NODE_ENV === 'production' ? true : false,
      // httpOnly: NODE_ENV === 'production' ? true : false,
      // sameSite: 'strict'
    // };
    // keep password from client by 'overriding it'
    // user.rows[0].user_password = undefined;

    // generate refresh token cookie to client/postman output
    res.cookie('refresh', signedRefreshToken, refreshOptions);

    // return res.json({ jwtToken }); // return jwt
    return res.json({
      status: "Successful login!",
      data: {
        token: jwtToken // signed, send to auth header save to LS
        // refreshToken // reftoken sent to id, may not need to send back
      }
    });
    // check user via email exists in db
    // user found - match password input val w/ encrypted password (db)
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error...");
  }
}

// successfully tested on postman
// call this route via client usseffect with settimeout to expire before access token actually expires
// refreh-token, call via front end redux or context, not yet working / implemented
exports.authRefreshToken = async (req, res, next) => {
  // res.send("this is the refresh route!");
  // get ref coookie!
  const { refresh } = req.cookies;

  // check for access token - may not need to send headers for refresh...
  // const accessToken = getAccessTokenFromHeaders(req.headers);

  if (!refresh) {
    return res.send("no refresh cookie exists!").json({token: ''});
  }
  // check if access token delivered via headers
  // if (!accessToken) {
    // res.status(401).send("Token not valid!");
  // }
  // verify token to get payload...
  const verifiedRefToken = validateRefreshToken(refresh);

  if (verifiedRefToken === null) {
    res.status(403).send('Failed to verify refresh token.');
    return; // maybe redirct / call logout
  }
  // console.log("-----------------------");
  // console.log("current access token");
  // console.log();
  // console.log();
  // console.log("Verified (current) refresh token");
  // console.log(verifiedRefToken);

  try {
    // then find a matching refresh token in the users db table, if one is found then the refresh token is still valid
    const refResult = await pool.query(
      'SELECT * FROM users WHERE refresh_token = $1', [verifiedRefToken]
    );

    if (refResult.rowCount === 0) {
      return res.status(401).json({ errors: [{ msg: "Unauthorized. Failed to find refresh token value." }] });
    }
    
    // generate and sign a new access token, then send to header to LS
    const userId = refResult.rows[0].id;

    const newAccessToken = accessTokenGenerator(userId);
    // if ref token matched ref token in database, generate a ne ref token
    const newRefreshTokenId = refreshTokenString();
    // update the db with the new reftoken
    const updateRefTokenInDb = await pool.query(
      'UPDATE users SET refresh_token = $1 WHERE id = $2 RETURNING *', [newRefreshTokenId, userId]
    );

    // console.log("==========================");
    // console.log("newly created ref token, updated in db");
    // console.log("new access token");
    // console.log(newAccessToken);
    
    // console.log("new refresh token");
    // console.log(newRefreshTokenId);
    // console.log("#############################");

    if (updateRefTokenInDb.rowCount === 0) {
      return res.status(401).json({ errors: [{ msg: "Unauthorized. Failed to update refresh token." }] });
    }
    // sign new reftokne id and create/update cookie
    const signedRefreshToken = refreshTokenGenerator(newRefreshTokenId);
        
    const refreshOptions = refreshTokenCookieOptions();

    // get the access token data via axios as:
    // res.data.data.token
    res.cookie('refresh', signedRefreshToken, refreshOptions);
    res.json({
      status: "Sucessfully generated new access and refresh tokens!",
      data: {
        token: newAccessToken // save to LS clientside
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error...");
  }
};

// refesh token, call this route from the App.js comp

// logout - remove refresh token - sucessfully tested on postman!
exports.authLogout = async (req, res, next) => {
  const { refresh } = req.cookies;
  // remove access token from localstorage:
  // console.log("attempting logout of user")
  if (!refresh) return "logout: no refresh cookie exists!"; 
  // verify token to get payload...
  // try {
  //   res.send("you have a cookie!")
  // } catch (err) {
  //   res.send("no cookie");
  // }
  const verifiedRefToken = validateRefreshToken(refresh);

  if (verifiedRefToken === null) {
    res.status(403).send('Failed to verify refresh token.');
    return; // maybe redirect / call logout (handles bu authJWT middleware)
  }
  // console.log("logging out:");
  // console.log(verifiedRefToken);
  // console.log("==============");
  // console.log(verifiedRefToken.refreshTokenId);

  try {
    // console.log("refresh token cookie has been verified!");
    // res.send("you have a cookie!")
    // clear existing cookies:
    const clearRefreshToken = await pool.query(
      'UPDATE users SET refresh_token = null WHERE refresh_token = $1 RETURNING *', [verifiedRefToken]
    );
    if (!clearRefreshToken.rows[0].refresh_token === null) {
      return res.status(403).json({ errors: [{ msg: "Unauthorized. Failed to nullify refresh token." }] });
    }

    // console.log(clearRefreshToken.rows[0].refresh_token);
    // res.send("successfully nulled refresh token");
    // res.clearCookie('refresh'); // instead of deleting, override
    res.cookie('refresh', '', { expires: new Date(1) });
    // to effectively "delete" a cookie, one must set the expiration to essentially be maxAge=1
    
    // when making a client req to the backend use:
    // will help out with cookies
    // await axios.post('http://localhost:4000/api/logout', { } , { withCredentials: true })
    
    res.send({ "success": "Logged out successfully!" });
    // implement login redirects later
    // return res.status(200).redirect("/login");
  } catch (err) {
    // res.send("no cookie?????");
    console.error(err.message);
    res.status(500).send("Failed while attempting logout!");
  }
};

/*
called by frontend login context
router.get("/loggedIn", (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.json(false);

    jwt.verify(token, process.env.JWT_SECRET);

    res.send(true);
  } catch (err) {
    res.json(false);
  }
});
module.exports = router;
*/