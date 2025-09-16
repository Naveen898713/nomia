// controllers/otpController.js
const otpStore = {}; // Temporary in-memory store { phone: otp }

// module.exports.sendOtp = async (req, res) => {
//   try {
//     const { number } = req.body;
//     if (!number) {
//       return res.status(400).json({ success: false, message: "Phone number is required" });
//     }

//     const otp = "1234"; // Static OTP
//     otpStore[number] = otp;

   
//     console.log(`OTP for ${number}: ${otp}`);

//     res.status(200).json({
//       success: true,
//       message: "OTP sent successfully",
//       otp, 
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, message: "Error sending OTP", error: error.message });
//   }
// };

// module.exports.resendOtp = async (req, res) => {
//   try {
//     const { number } = req.body;
//     if (!number) {
//       return res.status(400).json({ success: false, message: "Phone number is required" });
//     }

//     if (!otpStore[number]) {
//       return res.status(400).json({ success: false, message: "OTP not generated yet. Please request OTP first" });
//     }

//     const otp = otpStore[number];
//     console.log(`Resend OTP for ${number}: ${otp}`);

//     res.status(200).json({
//       success: true,
//       message: "OTP resent successfully",
//       otp, 
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, message: "Error resending OTP", error: error.message });
//   }
// };

// resendOtp

// sendOtp
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
// sendOtp
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



module.exports.resendOtp = async (req, res) => {
  try {
    const { number } = req.body;
    if (!number) {
      return res.status(400).json({ success: false, message: "Phone number is required" });
    }

    if (!otpStore[number]) {
      return res.status(400).json({ success: false, message: "OTP not generated yet. Please request OTP first" });
    }

    const otp = otpStore[number];
    console.log(`Resend OTP for ${number}: ${otp}`);

    res.status(200).json({
      success: true,
      message: "OTP resent successfully",
      otp,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error resending OTP", error: error.message });
  }
};


module.exports.verifyOtp = async (req, res) => {
  try {
    const { number, otp } = req.body;
    if (!number || !otp) {
      return res.status(400).json({ success: false, message: "Phone and OTP are required" });
    }

    if (otpStore[number] && otpStore[number] === otp) {
      delete otpStore[number]; // OTP use ho gaya, remove from memory
      return res.status(200).json({ success: true, message: "OTP verified successfully" });
    } else {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Error verifying OTP", error: error.message });
  }
};
