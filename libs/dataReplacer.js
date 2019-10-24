const mongoose = require('mongoose');
const User = mongoose.model('user');
const bCrypt = require('bcryptjs');
const jimp = require('jimp');

const dataReplacer = async (user, data) => {
  const {firstName, middleName, surName, oldPassword, newPassword} = data;
  console.log(data);
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
    await jimp.read(path.jion(req.file.path))
      .then(image => {
        image.resize(270, 270)
         .quality(90)
         .write(req.file.path);
      user.image = `/uploads/${req.file.filename}`
      })
      .catch(e => {
        console.log(e)
      });
    // const image = `/uploads/${req.file.filename}`;
    // user.set({image: image});
  }
  if(newPassword) {
    if(user.hash === bCrypt.hashSync(oldPassword, bCrypt.genSaltSync(10), null)){
      console.log(oldPassword, newPassword, hash);
      const hash = bCrypt.hashSync(newPassword, bCrypt.genSaltSync(10), null)
      user.set({hash});
    } else {
      return res.status(401).json({
        message: 'Password incorrect'
      });
    };
  }
  return user;
};

module.exports = dataReplacer;