
// routes/userRoutes.js
const express = require("express");
// const upload = require("../../Middleware/MulterMiddleware");
const { registerUser, getUser, updateUser, sendOtp, verifyOtp, getUserByToken, updateUserByToken, updateNominees } = require("../../Controllers/user/userController");
const upload = require("../../Middleware/Multer");
const router = express.Router();
// const upload = require("../middleware/upload");
// const { registerUser } = require("../controllers/userController");

router.post("/register", registerUser);
router.get('/get-user',getUserByToken);
router.post("/update", upload.single("photo"), updateUserByToken); 
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/update-nominees",updateNominees)
module.exports = router;
    