const passport = require('passport');
const jwt = require('jsonwebtoken');
const secret = require('../config/config.json').secret;
const mongoose = require('mongoose');
const User = mongoose.model('user');

module.exports.token = (req, res, next) => {
  const token = req.cookies.token;
  if (!!token) {
    User.findOne({ token }).then(user => {
      if (user) {
        req.logIn(user, err => {
          if (err) next(err);
        });
      }
      next();
    });
  } else {
    next();
  }
};

module.exports.index = (req, res, next) => {
  console.log(req.session);
  res.render('index.html', {
    user: req.user,
    message: req.flash('message'),
  });
};

module.exports.login = (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.redirect('/');
    }
    req.login(user, err => {
      if (err) next(err);
      if (req.body.remember) {
        const payload = {
          id: user.id,
        };
        const token = jwt.sign(payload, secret);
        res.json({ err: false, token: token });
      }
      let userData = {
        access_token: user.token,
        createdAt: Date.now(),
        firstName: user.fName,
        id: user.id,
        image: user.avatar,
        middleName: mName,
        password: user.password,
        surName: user.sName,
        username: user.username
      }
      res.json(userData)
      console.log(userData)
    });
  })(req, res, next);
};

module.exports.reg = (req, res, next) => {
  const { username, password, nick } = req.body;

  User.findOne({ username }).then(user => {
    if (user) {
      req.flash('message', 'Пользователь с таким логином уже существует');
      res.redirect('/registration');
    } else {
      const newUser = new User();
      newUser.username = username;
      newUser.setPassword(password);
      newUser
        .save()
        .then(user => {
          req.logIn(user, err => {
            if (err) next(err);
            req.flash('message', 'User create');
            return res.redirect('/');
          });
        })
        .catch(next);
    }
  });
};

module.exports.logout = async (req, res) => {
  await req.logout();
  res.clearCookie('token');
  req.flash('message', 'User logout');
  res.redirect('/');
};
