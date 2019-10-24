var express = require('express');
var router = express.Router();
const controllers = require('../../controllers/profile');
const checkAuth = require('../../middleware/check-auth');
const upload = require('../../libs/multer');

router.get('/', checkAuth, controllers.getProfile);
router.patch('/', checkAuth, upload, controllers.updateProfile);

module.exports = router;