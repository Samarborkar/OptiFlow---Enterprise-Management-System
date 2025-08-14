const express = require("express");
const router = express.Router();

const { sendEmail } = require("../services/sendEmail");

router.post("/sendEmail", sendEmail);

module.exports = router;