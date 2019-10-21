var express = require('express');
var router = express.Router();
const controllers = require('../../../controllers')

router.get('/', controllers.index);

router.post('/api/saveNewUser', controllers.reg);

router.post('/api/login', controllers.login);

router.post('/api/authFromToken', controllers.token);

// router.put('/api/updateUser/:id', controllers.update);

// router.delete('/api/deleteUser/:id', controllers.logout);

module.exports = router;
