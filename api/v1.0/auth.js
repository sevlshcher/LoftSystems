var express = require('express');
var router = express.Router();
const controllers = require('../../controllers/auth');

router.post('/registration', controllers.signup);

router.post('/login', controllers.login);

router.post('/refresh-token', controllers.refreshToken);

module.exports = router;
