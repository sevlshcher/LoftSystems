const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = mongoose.model('user');
const Token = mongoose.model('token');
const authHelper = require('../libs/authHelper');
const {secret, tokens} = require('../config/jwt-config').jwt;

const updateTokens = (userId) => {
  const accessToken = authHelper.generateAccessToken(userId);
  const refreshToken = authHelper.generateRefreshToken();

  return authHelper.replaceDbRefreshToken(refreshToken.id, userId)
    .then(() => ({
      accessToken,
      refreshToken: refreshToken.token,
      accessTokenExpiredAt: Date.now() + tokens.access.expiresIn * 1000,
      refreshTokenExpiredAt: Date.now() + tokens.refresh.expiresIn * 1000
    }));
};

exports.signup = (req, res, next) => {
  const {username, password, firstName, middleName, surName} = req.body;
  User.findOne({username})
    .exec()
    .then(user => {
      if(user) {
        return res.status(409).json({
          message: 'Username exists'
        });
      } else {
        const user = new User({username, firstName, middleName, surName});
        user.setPassword(password);
        user
          .save()
          .then(user => {
            updateTokens(user._id)
              .then(tokens => res.status(200).json({
                message: 'User created',
                ...user.transform(),
                ...tokens
              }))
            }
          )
          .catch(err => {
            console.log(err)
            res.status(500).json({
              error: err
            });
          });
        }
    });
};

exports.login = (req, res, next) => {
  const {username, password} = req.body;
  User.findOne({username})
    .exec()
    .then(user => {
      if(!user) {
        return res.status(401).json({
          message: 'Username doesn\'t exists'
        });
      }
      if(!user.validPassword(password)) {
        return res.status(401).json({
          message: 'Password incorrect'
        });
      } else {
        return updateTokens(user._id)
          .then(tokens => res.status(200).json({
            message: 'Auth successful',
            ...user.transform(),
            ...tokens
          }));
      }
    })
    .catch(err => res.status(500).json({message: err.message}));
};

exports.refreshToken = (req, res) => {
  const {refreshToken} = req.body;
  let payload;
  try {
    payload = jwt.verify(refreshToken, secret);
    if(payload.type !== 'refresh') {
      res.status(400).json({
        message: 'Invalid token!'
      });
      return;
    }
  } catch (e) {
    if(e instanceof jwt.TokenExpiredError) {
      res.status(400).json({
        message: 'Token expired!'
      });
      return;
    } else if(e instanceof jwt.JsonWebTokenError) {
      res.status(400).json({
        message: 'Invalid token!'
      });
      return;
    }
  }
  Token.findOne({tokenId: payload.id})
    .exec()
    .then(token => {
      if(token === null) {
        throw new Error('Invalid token!')
      }
      return updateTokens(token.userId);
    })
    .then(tokens => res.json(tokens))
    .catch(err => res.status(400).json({message: err.message}));
};