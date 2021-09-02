const express = require('express');
const { landing, userLogin, userSignUp } = require('../controllers/indexController');
const router = express.Router()

router.get('/', landing);

router.post('/login', userLogin);

router.post('/signup', userSignUp);

module.exports = router;