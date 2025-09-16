const express = require("express");
// const { generateOtp, verifyOtp } = require("../Controllers/otpController");
const { sendOtp, verifyOtp } = require("../Controllers/SendOtpControllers");
const router = express.Router();

// router.post("/generate", generateOtp);
router.post("/generate", sendOtp);
router.post("/verify", verifyOtp);

module.exports = router;
