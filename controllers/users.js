const mongoose = require('mongoose');
const User = mongoose.model('user');

function getAllUsers(res) {
  User.find({}, (err, user) => {
    let items = JSON.parse(JSON.stringify(user));
    items.forEach(item => item.id = item._id);
    res.json(items);
  });
}

exports.getUsers = async (req, res, next) => {
  getAllUsers(res);
};

exports.updateUsers = (req, res, next) => {
  User.updateOne({ _id: req.params.id }, req.body, () => {
    getAllUsers(res);
  });
};

exports.deleteUsers = async (req, res, next) => {
  User.findOneAndDelete({_id: req.params.id}, () => {
    getAllUsers(res);
  });
};