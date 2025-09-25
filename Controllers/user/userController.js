// controllers/userController.js

const OtpModal = require("../../Modals/OtpModal");
const UsrModel = require("../../Modals/UsrModel");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET
module.exports.registerUser = async (req, res) => {
  try {
    const { name, email, dateOfBirth, gender, number, nomineeOne, nomineeSec } = req.body;

    if (!name || !dateOfBirth || !gender || !number) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    // Check for existing user by number or email
    const userExists = await UsrModel.findOne({
      $or: [{ number }, { email }]
    });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "User with this email or number already exists"
      });
    }

    // Create new user
    const newUser = new UsrModel({
      name,
      email,
      dateOfBirth,
      gender,
      number,
      nomineeOne,
      nomineeSec,
    });

    await newUser.save();

    // Generate JWT token (without saving in DB)
    const token = jwt.sign(
      { userId: newUser._id },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: newUser,
      token
    });

  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: `Duplicate field: ${Object.keys(error.keyValue)} already exists`
      });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};


// Get user by ID
module.exports.getUserByToken = async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      return res.status(401).json({ success: false, message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ success: false, message: "Invalid token format" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch user by userId from token
    const user = await UsrModel.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, data: user });

  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ success: false, message: "Invalid token" });
    } else if (error.name === "TokenExpiredError") {
      return res.status(401).json({ success: false, message: "Token expired" });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};
// controllers/userController.js

module.exports.updateUserByToken = async (req, res) => {
  try {
    // 1. Token uthao
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      return res.status(401).json({ success: false, message: "Authorization header missing" });
    }

    const token = authHeader.split(" ")[1]; // Bearer <token>
    if (!token) {
      return res.status(401).json({ success: false, message: "Token missing" });
    }

    // 2. Token verify
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ success: false, message: "Invalid or expired token" });
    }

    // 3. User find karo
    const user = await UsrModel.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // 4. Update fields prepare karo
    const { name, dateOfBirth, gender, number, nomineeOne, nomineeSec } = req.body;
    const updatedData = {};

    if (name) updatedData.name = name;
    if (dateOfBirth) updatedData.dateOfBirth = dateOfBirth;
    if (gender) updatedData.gender = gender;
    if (number) updatedData.number = number;
    if (nomineeOne) updatedData.nomineeOne = nomineeOne;
    if (nomineeSec) updatedData.nomineeSec = nomineeSec;

    // 5. Photo upload check
    if (req.file) {
      updatedData.photo = req.file.path; // multer se file ka path
    }

    // 6. User update karo
    const updatedUser = await UsrModel.findByIdAndUpdate(user._id, updatedData, { new: true });

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Update user error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};

module.exports.sendOtp = async (req, res) => {
  try {
    const { number, countryCode } = req.body;

    if (!number || !countryCode) {
      return res.status(400).json({ success: false, message: "Number and country code are required" });
    }

    const fullNumber = `${countryCode}${number}`;
    // const otp = Math.floor(1000 + Math.random() * 9000).toString(); 
       const otp="0000"
    // Save OTP in DB
    await OtpModal.findOneAndUpdate(
      { number: fullNumber },
      { otp, createdAt: new Date() },
      { upsert: true, new: true }
    );

    console.log(`OTP for ${fullNumber}: ${otp}`);

    res.status(200).json({
      success: true,
      message: "OTP sent successfully",
      // number: fullNumber,
      // otp, // dev/testing only

    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error sending OTP", error: error.message });
  }
};



module.exports.verifyOtp = async (req, res) => {
  try {
    const { number, countryCode, otp } = req.body;
    if (!number || !otp || !countryCode) {
      return res.status(400).json({ success: false, message: "Number, country code, and OTP are required" });
    }

    const fullNumber = `${countryCode}${number}`;

    // Check OTP in DB
    const otpRecord = await OtpModal.findOne({ number: fullNumber });
    if (!otpRecord || otpRecord.otp !== otp) {
      return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
    }

    // OTP matched → remove OTP record
    await OtpModal.deleteOne({ number: fullNumber });

    // Find user by number
    const user = await UsrModel.findOne({ number:number });

    if (!user) {
      // ✅ OTP sahi hai but user register nahi hai
      return res.status(200).json({
        success: true,
        message: "OTP verified successfully",
      });
    }

    // ✅ OTP sahi hai & user exist
    const token = jwt.sign(
      { userId: user._id, number: user.number, email: user.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully",
      user,
      token
    });

  } catch (error) {
    res.status(500).json({ success: false, message: "Error verifying OTP", error: error.message });
  }
};



module.exports.updateNominees = async (req, res) => {
  try {

    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      return res.status(401).json({ success: false, message: "Authorization header missing" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ success: false, message: "Token missing" });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ success: false, message: "Invalid or expired token" });
    }

    // 3. User find karo
    const user = await UsrModel.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // 4. Only nominees update
    const { nomineeOne, nomineeSec } = req.body;
    if (!nomineeOne && !nomineeSec) {
      return res.status(400).json({ success: false, message: "At least one nominee is required to update" });
    }

    if (nomineeOne) user.nomineeOne = nomineeOne;
    if (nomineeSec) user.nomineeSec = nomineeSec;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Nominees updated successfully",
      data: {
        nomineeOne: user.nomineeOne,
        nomineeSec: user.nomineeSec,
      },
    });

  } catch (error) {
    console.error("Update nominees error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};
