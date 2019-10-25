var express = require('express');
var router = express.Router();
const controllers = require('../../controllers/profile');
const upload = require('../../middleware/multer');
const checkAuth = require('../../middleware/check-auth')

router.get('/', checkAuth, controllers.getProfile);
router.patch('/', checkAuth, upload, controllers.updateProfile);

module.exports = router;