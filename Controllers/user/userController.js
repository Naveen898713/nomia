// controllers/userController.js

const UsrModel = require("../../Modals/UsrModel");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET
module.exports.registerUser = async (req, res) => {
  console.log("JWT_SECRET from env:", process.env.JWT_SECRET);
  try {
    const { name, email, dateOfBirth, gender, number, nominee } = req.body;

    if (!name || !email || !dateOfBirth || !gender || !number || !nominee) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const userExists = await UsrModel.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: "Email already registered" });
    }

    const newUser = new UsrModel({
      name,
      email,
      dateOfBirth,
      gender,
      number,
      nominee,
      photo: req.file ? req.file.path : null, // multer se file aayegi
    });

    await newUser.save();
    const token = jwt.sign(
      { userId: newUser._id, email: newUser.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );
    res.status(201).json({ success: true, message: "User registered successfully", data: newUser ,token : token});
    console.log(token)
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// Get user by ID
module.exports.getUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await UsrModel.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



// controllers/userController.js

module.exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, dateOfBirth, gender, number, nominee } = req.body;

    // New data object
    const updatedData = {
      name,
      dateOfBirth,
      gender,
      number,
      nominee,
    };

    // If photo uploaded, add it
    if (req.file) {
      updatedData.photo = req.file.path;
    }

    const user = await UsrModel.findByIdAndUpdate(id, updatedData, { new: true });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, message: "User updated successfully", data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



let otpStore = {};  
module.exports.sendOtp = async (req, res) => {
  try {
    const { number } = req.body;
    if (!number) {
      return res.status(400).json({ success: false, message: "Phone number is required" });
    }

    const otp = "1234"; // static
    otpStore[number] = otp;

    console.log(`OTP for ${number}: ${otp}`);

    res.status(200).json({
      success: true,
      message: "OTP sent successfully",
      otp, // dev ke liye bhej rahe
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error sending OTP", error: error.message });
  }
};

module.exports.verifyOtp = async (req, res) => {
  try {
    const { number, otp } = req.body;
    if (!number || !otp) {
      return res.status(400).json({ success: false, message: "Phone and OTP are required" });
    }

    if (otpStore[number] && otpStore[number] === otp) {
      delete otpStore[number]; // OTP used, remove from memory

      // ✅ Find user by phone number
      const user = await UsrModel.findOne({number:number });
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }

      // ✅ Generate JWT
      const token = jwt.sign(
        { userId: user._id, phone: user.phone, email: user.email },
        JWT_SECRET,
        { expiresIn: "7d" }
      );

      return res.status(200).json({
        success: true,
        message: "OTP verified successfully",
        user,
        token,
      });
    } else {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Error verifying OTP", error: error.message });
  }
};
