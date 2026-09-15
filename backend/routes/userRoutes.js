const router = require('express').Router();
const auth = require('../middleware/auth');
const { me } = require('../controllers/authController');

router.get('/me', auth, me);

module.exports = router;