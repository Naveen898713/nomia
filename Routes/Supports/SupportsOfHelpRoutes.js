// routes/otpRoutes.js
const express = require("express");
const { AddHelpSupport, getAllSupportOfHelp } = require("../../Controllers/Supports/SupportsControllers");



const router = express.Router();

router.post("/add",AddHelpSupport);
router.get("/get-all", getAllSupportOfHelp);
// router.post("/verify-otp", verifyOtp);

module.exports = router;
