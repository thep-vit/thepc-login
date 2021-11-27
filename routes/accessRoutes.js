const { toggleAccess } = require('../controllers/AccessController');
const {adminAuth} = require('../middleware/auth');

const router = require('express').Router();

router.post('/toggle', adminAuth, toggleAccess);

module.exports = router;