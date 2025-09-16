// routes/otpRoutes.js
const express = require("express");

const { resendOtp, sendOtp, verifyOtp } = require("../../Controllers/OTP/otpControllers");
// const { verifyOtp } = require("../../Controllers/otpController");
// const { sendOtp, resendOtp, verifyOtp } = require("../controllers/otpController");

const router = express.Router();

router.post("/send-otp", sendOtp);
router.post("/resend-otp", resendOtp);
router.post("/verify-otp", verifyOtp);

module.exports = router;
