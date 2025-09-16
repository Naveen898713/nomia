const twilio = require("twilio");

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// 📍 Send OTP
module.exports.sendOtp = async (req, res) => {
  try {
    let { number } = req.body;

    if (!number) {
      return res.status(400).json({ success: false, message: "Number is required" });
    }

    // Convert to E.164 format
    number = number.toString();
    if (!number.startsWith("+91")) {
      number = "+91" + number;
    }

    const verification = await client.verify.v2
      .services(process.env.TWILIO_VERIFY_SID)
      .verifications.create({ to: number, channel: "sms" });

    res.status(200).json({
      success: true,
      message: "OTP sent successfully",
      status: verification.status,
    });
  } catch (error) {
    res.status(error.status || 500).json({
      success: false,
      message: error.message,
    });
  }
};

// when i get paid 

// const client = require("twilio")(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// module.exports.sendCustomOtp = async (req, res) => {
//   try {
//     let { number } = req.body;
//     if (!number) return res.status(400).json({ success: false, message: "Number is required" });

//     number = number.toString();
//     if (!number.startsWith("+91")) number = "+91" + number;

//     // Generate your own OTP
//     const otp = Math.floor(1000 + Math.random() * 9000);

//     // Save otp in DB here if you want to verify later
//     // await OtpModel.create({ number, otp });

//     const message = await client.messages.create({
//       from: process.env.TWILIO_PHONE_NUMBER, // must be your Twilio number
//       to: number,
//       body: `🔐 Your MyApp OTP is: ${otp}. Please do not share it.`
//     });

//     res.json({ success: true, message: "OTP sent", sid: message.sid, otp }); // remove otp in production
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };


// 📍 Verify OTP
module.exports.verifyOtp = async (req, res) => {
  try {
    let { number, otp } = req.body;

    if (!number || !otp) {
      return res.status(400).json({ success: false, message: "Number and OTP are required" });
    }

    number = number.toString();
    if (!number.startsWith("+91")) {
      number = "+91" + number;
    }

    const verificationCheck = await client.verify.v2
      .services(process.env.TWILIO_VERIFY_SID)
      .verificationChecks.create({ to: number, code: otp });

    if (verificationCheck.status === "approved") {
      return res.status(200).json({ success: true, message: "OTP verified successfully" });
    } else {
      return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
    }
  } catch (error) {
    res.status(error.status || 500).json({
      success: false,
      message: error.message,
    });
  }
};
