const mongoose = require('mongoose');
const User = mongoose.model('user');

exports.getProfile = (req, res, next) => {
  const user = User.findById(req.user.userId)
  if(!user) {
    return res.status(401).json({
      message: 'Seems there are no any user'
    });
  } else {
    console.log(user)
    res.status(200).json({...user.transform});
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const user = await User.findOne({_id: req.user.userId});
    console.log(user);
    const requestData = req.body;
    const someDataReplacer = (someUser, someData) => {
      const {firstName, middleName, surName} = someData;
      if(firstName) {
        someUser.firstName = firstName;
      }
      someUser.set({firstName});
      if(middleName) {
        someUser.middleName = middleName;
      }
      someUser.set({middleName});
      if(surName) {
        someUser.surName = surName;
      }
      someUser.set({surName});
      return someUser;
    };
    console.log(requestData.firstName);
    const dataReplacer = someDataReplacer(user, requestData);
    console.log(dataReplacer.id);
    const updatedUser = await User.findByIdAndUpdate(
      {_id: dataReplacer.id},
      {$set: dataReplacer},
      {new: true}
    );
    console.log(updatedUser);
    res.json(updatedUser);
  } catch (e) {
    res.status(400).json({message: 'Data update error'});
  };
  // await User.findById(req.user.userId)
  //   .exec()
  //   .then(user => {
  //     const filter = {firstName: user.firstName};
  //     const update = {firstName: firstName};
    
  //     let updateUser = User.findByIdAndUpdate(filter, update, {new: true});
  //     res.json(updateUser);
  //     })
  //     .catch(err => res.status(500).json({message: err.message}));


  // User.findById(req.user.userId)
  //   .exec()
  //   .then(user => {
  //     if(!user) {
  //       return res.status(401).json({
  //         message: 'Seems there are no any user'
  //       });
  //     } else {
  //       if(firstName) {
  //         user.firstName = firstName;
  //       }
  //       user.set({firstName});
  //       if(middleName) {
  //         user.middleName = middleName;
  //       }
  //       user.set({middleName});
  //       if(surName) {
  //         user.surName = surName;
  //       }
  //       user.set({surName});
  //       if(newPassword) {
  //         if(!user.validPassword(oldPassword)) {
  //           return res.status(401).json({
  //             message: 'Password incorrect'
  //           });
  //         } else {
  //           user.setPassword(newPassword);
  //         }
  //       }
  //       user.save()
  //         .then(r => {
  //           console.log(r);
  //           res.status(200).json({
  //           message: 'Profile updated',
  //           ...r.transform()
  //         })
  //       });
  //       };
  //   })
  //   .catch(err => res.status(500).json({message: err.message}));
}