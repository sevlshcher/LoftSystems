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
      type: mongoose.Types.ObjectId,
      ref: 'user'
    },
  }, {versionKey: false}
);

mongoose.model('news', newsSchema);