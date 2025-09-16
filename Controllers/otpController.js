const OtpModal = require("../Modals/OtpModal");


// Generate OTP
module.exports.generateOtp = async (req, res) => {
  try {
    const { number } = req.body;

    if (!number) {
      return res.status(400).json({
        success: false,
        message: "Number is required",
      });
    }

    // Generate 4-digit OTP
    const otp = Math.floor(1000 + Math.random() * 9000);

    // Save OTP in DB (overwrite old one for same number)
    await OtpModal.findOneAndUpdate(
      { number },
      { otp, createdAt: Date.now() },
      { upsert: true, new: true }
    );

    // In real project → send OTP via SMS/Email (Twilio, etc.)
    res.status(200).json({
      success: true,
      message: "OTP generated successfully",
      otp, // ❌ remove this in production
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Verify OTP
module.exports.verifyOtp = async (req, res) => {
  try {
    const { number, otp } = req.body;

    if (!number || !otp) {
      return res.status(400).json({
        success: false,
        message: "Number and OTP are required",
      });
    }

    const otpRecord = await OtpModal.findOne({ number });

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: "OTP not found or expired",
      });
    }

    if (parseInt(otp) === otpRecord.otp) {
      // ✅ OTP matched → delete from DB after success
      await Otp.deleteOne({ number });
      return res.status(200).json({
        success: true,
        message: "OTP verified successfully",
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
