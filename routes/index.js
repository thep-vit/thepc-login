const express = require('express');
const { loginPage, userLogin, userSignUp, signUpPage, getAllUsers } = require('../controllers/indexController');
const router = express.Router()
const {auth} = require('../middleware/auth');

router.get('/', loginPage);

router.get('/signup', signUpPage);

router.post('/login', userLogin);

router.post('/signup', userSignUp);

router.get('/users', auth, getAllUsers);

module.exports = router;