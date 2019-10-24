const mongoose = require('mongoose');
const User = mongoose.model('user');
const serialize = require('../libs/serialize');
const someDataReplacer = require('../libs/dataReplacer');

exports.getProfile = async (req, res, next) => {
  const user = await User.findById(req.user.userId)
  if(!user) {
    return res.status(401).json({
      message: 'Seems there are no any user'
    });
  } else {
    const userSerialize = serialize(user);
    await res.status(200).json({userSerialize});
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const user = await User.findOne({_id: req.user.userId});
    console.log(user);
    const requestData = req.body;
    // console.log(req.file.filename, );
    const dataReplacer = someDataReplacer(user, requestData);
    const updatedUser = await dataReplacer.save();
    console.log(updatedUser);
    res.json(updatedUser);
  } catch (e) {
    res.status(400).json({message: 'Data update error'});
  };
}