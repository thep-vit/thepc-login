const express = require("express");
const { requestLinkPage, requestLink, passwordResetPage, resetPassword } = require("../controllers/resetPasswordController");
const router = express.Router();

router.get('/', requestLinkPage);

router.post('/', requestLink);

router.get('/:token', passwordResetPage);

router.post('/:token', resetPassword);

module.exports = router;