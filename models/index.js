const mongoose = require('mongoose');
require('dotenv').config()

mongoose.Promise = global.Promise;

mongoose.connect(
  process.env.CONNECT_DB,
  { useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false }
);

require('./user');
require('./token');

mongoose.connection.on('connected', () => {
  console.log(
    'Mongoose connected'
  );
});

mongoose.connection.on('error', err => {
  console.log('Mongoose connection error: ' + err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected');
});

process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    console.log('Mongoose connection disconnected app termination');
    process.exit(0);
  });
});