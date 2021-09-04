const express = require("express");
const { requestLinkPage, requestLink, passwordResetPage, resetPassword } = require("../controllers/resetPasswordController");
const router = express.Router();
const {check} = require("express-validator");

router.get('/', requestLinkPage);

router.post('/', requestLink);

router.get('/link-message', (req, res)=> res.render('link-message'))

router.get('/:token', passwordResetPage);

router.post('/:token', check('password').not().isEmpty().isLength({min: 6}).withMessage('Must be at least 6 chars long'),
check('password2', 'Passwords do not match').custom((value, {req}) => (value === req.body.password)), resetPassword);

router.get('/reset-success', (req, res) => res.render('reset-success'))

module.exports = router;