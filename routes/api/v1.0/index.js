var express = require('express');
var router = express.Router();
const controllers = require('../../../controllers')

router.post('/api/registration', controllers.signup);

router.post('/api/login', controllers.login);

// router.post('/api/refresh-token', controllers.token);

// router.put('/api/updateUser/:id', controllers.update);

// router.delete('/api/deleteUser/:id', controllers.logout);

module.exports = router;
