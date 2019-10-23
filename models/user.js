const mongoose = require('mongoose');
const bCrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username required'],
    unique: true,
  },
  hash: {
    type: String,
    required: [true, 'Password required'],
  },
  firstName: {
    type: String,
    default: null,
  },
  middleName: {
    type: String,
    default: null,
  },
  surName: {
    type: String,
    default: null,
  },
  image: {
    type: String,
    default: null,
  },
  permission: {
    chat: {
      C: {
        type: Boolean,
        default: true
      },
      R: {
        type: Boolean,
        default: true
      },
      U: {
        type: Boolean,
        default: true
      },
      D: {
        type: Boolean,
        default: true
      },
    },
    news: {
      C: {
        type: Boolean,
        default: false
      },
      R: {
        type: Boolean,
        default: true
      },
      U: {
        type: Boolean,
        default: false
      },
      D: {
        type: Boolean,
        default: false
      },
    },
    settings: {
      C: {
        type: Boolean,
        default: false
      },
      R: {
        type: Boolean,
        default: false
      },
      U: {
        type: Boolean,
        default: false
      },
      D: {
        type: Boolean,
        default: false
      },
    },
  },
});

userSchema.methods.setPassword = function(password) {
  this.hash = bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
};

userSchema.methods.validPassword = function(password) {
  return bCrypt.compareSync(password, this.hash);
};

userSchema.methods.setToken = function(token) {
  this.token = token;
};

mongoose.model('user', userSchema);
