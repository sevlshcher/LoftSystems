const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = mongoose.model('user');
const Token = mongoose.model('token');
const authHelper = require('../libs/authHelper');
const {secret} = require('../config/jwt-config').jwt;

const updateTokens = (userId) => {
  const accessToken = authHelper.generateAccessToken(userId);
  const refreshToken = authHelper.generateRefreshToken();

  return authHelper.replaceDbRefreshToken(refreshToken.id, userId)
    .then(() => ({
      accessToken,
      refreshToken: refreshToken.token
    }));
};

const signup = (req, res, next) => {
  const {username, password, firstName, middleName, surName} = req.body;
  User.findOne({username})
    .exec()
    .then(user => {
      if(user) {
        return res.status(409).json({
          message: 'Username exists'
        });
      } else {
        const user = new User({firstName, middleName, surName,
          id: new mongoose.Types.ObjectId(),
          username: username
        });
        user.setPassword(password);
        user
          .save()
          .then(result => {
            console.log(result)
            res.status(201).json({
              message: 'User created'
            });
          })
          .catch(err => {
            console.log(err)
            res.status(500).json({
              error: err
            });
          });
        }
    });
};

const login = (req, res, next) => {
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
            tokens: tokens
          }));
      }
    })
    .catch(err => res.status(500).json({message: err.message}));
};

const refreshToken = (req, res) => {
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

module.exports = {
  signup,
  login,
  refreshToken
};





// module.exports.token = (req, res, next) => {
//   const token = req.cookies.token;
//   if (!!token) {
//     User.findOne({ token }).then(user => {
//       if (user) {
//         req.logIn(user, err => {
//           if (err) next(err);
//         });
//       }
//       next();
//     });
//   } else {
//     next();
//   }
// };

// module.exports.index = (req, res, next) => {
//   console.log(req.session);
//   res.render('index.html', {
//     user: req.user,
//     message: req.flash('message'),
//   });
// };

// module.exports.login = (req, res, next) => {
//   passport.authenticate('local', (err, user, info) => {
//     if (err) {
//       return next(err);
//     }
//     if (!user) {
//       return res.redirect('/');
//     }
//     req.login(user, err => {
//       if (err) next(err);
//       if (req.body.remember) {
//         const payload = {
//           id: user.id,
//         };
//         const token = jwt.sign(payload, secret);
//         res.json({ err: false, token: token });
//       }
//       let userData = {
//         access_token: user.token,
//         createdAt: Date.now(),
//         firstName: user.fName,
//         id: user.id,
//         image: user.avatar,
//         middleName: mName,
//         password: user.password,
//         surName: user.sName,
//         username: user.username
//       }
//       res.json(userData)
//       console.log(userData)
//     });
//   })(req, res, next);
// };

// module.exports.reg = (req, res, next) => {
//   const { username, password, nick } = req.body;

//   User.findOne({ username }).then(user => {
//     if (user) {
//       req.flash('message', 'Пользователь с таким логином уже существует');
//       res.redirect('/registration');
//     } else {
//       const newUser = new User();
//       newUser.username = username;
//       newUser.setPassword(password);
//       newUser
//         .save()
//         .then(user => {
//           req.logIn(user, err => {
//             if (err) next(err);
//             req.flash('message', 'User create');
//             return res.redirect('/');
//           });
//         })
//         .catch(next);
//     }
//   });
// };

// module.exports.logout = async (req, res) => {
//   await req.logout();
//   res.clearCookie('token');
//   req.flash('message', 'User logout');
//   res.redirect('/');
// };
