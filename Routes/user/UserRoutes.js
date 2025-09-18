
// routes/userRoutes.js
const express = require("express");
// const upload = require("../../Middleware/MulterMiddleware");
const { registerUser, getUser, updateUser, sendOtp, verifyOtp } = require("../../Controllers/user/userController");
const upload = require("../../Middleware/Multer");
const router = express.Router();
// const upload = require("../middleware/upload");
// const { registerUser } = require("../controllers/userController");

router.post("/register", upload.single("photo"), registerUser);
router.get('/get/:id',getUser);
router.post("/update/:id", upload.single("photo"), updateUser); 
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
module.exports = router;
