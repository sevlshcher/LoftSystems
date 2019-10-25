const mongoose = require('mongoose');
const User = mongoose.model('user');

module.exports = value => {
  return (req, res, next) => {
    const user = User.findOne({_id: req.user._id});
    if(!!!user.permission.settings[value]) {
      return res.status(400).json({message: 'Access denied'});
    }
    next();
  }
};