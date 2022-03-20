const express = require("express");
const router = new express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Register, findUser, storeJWT, Logout, CheckJWTPresence } = require('./database')
require('dotenv').config();

router.post('/register', async (req, res) => {
  try {
    const salt = await bcrypt.genSalt();
    const hpassword = await bcrypt.hash(req.body.password, salt);
    const mail = req.body.mail;
    if (!mail.includes('@')) return res.status(400).send()
    try {
      const response = await Register(req.body.username, hpassword, mail).catch((err) => {
        throw ("Database_error")
      })
      if (response == 0) {
        return res.status(403).send('user already exists');
      }
    }
    catch (err) {
      return res.status(500).send(err);
    };
    res.status(204).send();
  } catch (er) {
    console.log(er);
    res.status(500).send();
  }
})

router.post('/test', authenticateUser, async (req, res) => {
  res.status(201).send('user logged in')
})
//Login and get JWT tokens
router.post('/login', async (req, res) => {
  const username = req.body.username;
  let user;
  try {
    user = (await findUser(username).catch((err) => {
      throw ("Database_error");
    }))[0]
  }
  catch (err) {
    res.status(500).send(err);
    return;
  }
  if (user == undefined) {
    return res.status(400).send('Password or username not matching')
  }
  try {
    if (!await bcrypt.compare(req.body.password, user.password)) {
      return res.status(400).send('Password or username not matching')
    }
    const tokenParams = { username: user.username, id: user.id };
    const accessToken = generateAccessToken(tokenParams);
    const refreshToken = jwt.sign(tokenParams, process.env.REFRESH_SECRET_TOKEN, { expiresIn: process.env.REFRESH_EXPIRATION_TIME })
    await storeJWT(user.id, refreshToken).catch((err) => {
      throw ("Database_error")
    })
    res.status(201);
    res.cookie('refreshToken', refreshToken, {
      secure: process.env.NODE_ENV !== "development",
      httpOnly: true,
      SameSite: 'LAX'
    })

    res.json({ accessToken: accessToken, username: username });
    res.send();
  }
  catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
})


//get new access_token
router.post('/token', getCookie, async (req, res) => {

  try {

    const cookies = req.cookie;
    const refreshToken = cookies.find((cookie) => { return cookie[0] === 'refreshToken' })[1];
    if (refreshToken == null || refreshToken == undefined) {
      return res.status(401).send();
    }

    jwt.verify(refreshToken, process.env.REFRESH_SECRET_TOKEN, async (err, user) => {
      if (err) {
        return res.status(403).send('invalid token');
      }
      try {
        const isValid = await CheckJWTPresence(user.username, refreshToken).catch(err => {
          throw ("Database_error");
        });
        if (!isValid) return res.status(403).send('invalid token');
      }
      catch (err) {
        return res.status(500).send(err)
      }
      const accessToken = generateAccessToken({ username: user.username, id: user.id })
      res.json({ accessToken: accessToken, username: user.username });
      res.status(201).send();
    })

  }
  catch (e) {
    console.log(e);
    res.status(500).send();
  }
})

//delete refresh token
router.delete('/logout', authenticateUser, async (req, res) => {
  const username = req.user.username;
  try {
    const isValid = await Logout(username).catch(err => {
      return res.status(500).send("Database_error");
    });;
    if (!isValid) return res.status(403).send();
    res.status(204).clearCookie('refreshToken').send();
  }
  catch (e) {
    console.log(e);
    res.status(500).send();
  }
})

//#region helpFuncts
function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_SECRET_TOKEN, { expiresIn: process.env.ACCESS_EXPIRATION_TIME })
}

function getCookie(req, res, next) {
  if (req.headers.cookie == undefined) {
    return res.status(401).send('cookie missing');
  }
  req.cookie = req.headers.cookie.split(' ').map((data) => data.split('='));
  next();
}

function authenticateUser(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (authHeader == undefined || authHeader == null) {
    return res.status(401).send();
  }
  const token = authHeader.split(' ')[1];

  jwt.verify(token, process.env.ACCESS_SECRET_TOKEN, (err, user) => {
    if (err) return res.status(403).send();
    req.user = user;
    next();
  })
}
//#endregion
module.exports = router;
module.exports.authenticateUser = authenticateUser;