const mongoose = require("mongoose");

const OtpSchema = new mongoose.Schema({
  number: { type: String, required: true },      // full number with country code
  otp: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 300 } // auto delete after 5 min
});

module.exports = mongoose.model("Otp", OtpSchema);
