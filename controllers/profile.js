const mongoose = require('mongoose');
const User = mongoose.model('user');

exports.getProfile = (req, res, next) => {
  User.findById(req.user.id)
    .exec()
    .then(user => {
      if(user) {
        console.log(user)
        res.status(200).json({...user.transform});
      } else {
        return res.status(401).json({
          message: 'Seems there are no any user'
        });
      }
    })
    .catch(err => res.status(500).json({message: err.message}));
};

exports.updateProfile = (req, res, next) => {
  const {firstName, middleName, surName, oldPassword, newPassword} = req.body;
  // console.log(req.user.id, req.user._id, req.token, req.token.id)
  User.findById(req.user.id)
    .exec()
    .then(user => {
      user.firstName = firstName;
      user.middleName = middleName;
      user.surName = surName;
      if(newPassword) {
        if(!user.validPassword(oldPassword)) {
          return res.status(401).json({
            message: 'Password incorrect'
          });
        } else {
          user.setPassword(newPassword);
        }
      }
    })
    user.save()
      .then(user => res.status(200).json({
        message: 'Profile updated',
        ...user.transform()
      }))
    .catch(err => res.status(500).json({message: err.message}));
}