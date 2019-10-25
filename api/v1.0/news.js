var express = require('express');
var router = express.Router();
const controllers = require('../../controllers/news');
const checkAuth = require('../../middleware/check-auth');

router.get('/', checkAuth, controllers.getNews);
router.post('/', checkAuth, controllers.postNews);
router.patch('/:id', checkAuth, controllers.updateNews);
router.delete('/:id', checkAuth, controllers.deleteNews);

module.exports = router;