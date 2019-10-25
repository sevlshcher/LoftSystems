var express = require('express');
var router = express.Router();
const controllers = require('../../controllers/users');
const checkAuth = require('../../middleware/check-auth');

router.get('/', checkAuth, controllers.getUsers);
router.patch('/:id/permission', checkAuth, controllers.updateUsers);
router.delete('/:id', checkAuth, controllers.deleteUsers);

module.exports = router;