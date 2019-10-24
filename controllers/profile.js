const mongoose = require('mongoose');
const User = mongoose.model('user');
const serialize = require('../libs/serialize');
const jimp = require('jimp');
const bCrypt = require('bcryptjs');

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
    const {firstName, middleName, surName, oldPassword, newPassword } = req.body;
    if(firstName) {
      user.set({firstName});
    }
    if(middleName) {
      user.set({middleName});
    }
    if(surName) {
      user.set({surName});
    }
    if(req.file) {
      console.log(req.file, req.file.path);
      await jimp.read(req.file.path)
        .then(image => {
          image.resize(270, 270)
          .quality(90)
          .write(req.file.path);
          user.set({image: `/uploads/${req.file.filename}`});
        })
        .catch(e => {
          console.log(e)
        });
    }
    if(newPassword) {
      console.log(oldPassword, bCrypt.compareSync(oldPassword, user.hash));
      if(bCrypt.compareSync(oldPassword, user.hash)){
        const hash = bCrypt.hashSync(newPassword, bCrypt.genSaltSync(10), null)
        console.log(user.hash, hash)
        user.set({hash});
      } else {
        return res.status(401).json({
          message: 'Password incorrect'
        });
      };
    }
    const updatedUser = await user.save();
    console.log(updatedUser);
    res.json(updatedUser);
  } catch (e) {
    console.log(e)
    res.status(400).json({message: 'Data update error'});
  };
}
