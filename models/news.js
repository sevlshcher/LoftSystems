const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema(
    {
    created_at: {
      type: Date,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    user: {
        firstName: {type: String},
        id: {type: String},
        image: {type: String},
        middleName: {type: String},
        surName: {type: String},
        username: {type: String},
    },
  }, {versionKey: false}
);

mongoose.model('news', newsSchema);