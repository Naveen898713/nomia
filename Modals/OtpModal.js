const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  number: {
    type: String,
    required: true,
  },
  otp: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 120, // document auto-deletes after 120 sec (2 minutes)
  },
});

module.exports = mongoose.model("generateOtp", otpSchema);
