const express = require('express');
const { loginPage, userLogin, userSignUp, signUpPage } = require('../controllers/indexController');
const router = express.Router()

router.get('/', loginPage);

router.get('/signup', signUpPage);

router.post('/login', userLogin);

router.post('/signup', userSignUp);

module.exports = router;