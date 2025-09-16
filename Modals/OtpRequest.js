const mongoose = require("mongoose");

const otpRequestSchema = new mongoose.Schema({
  number: { type: String, required: true },
  status: { type: String, default: "pending" }, // pending | approved | failed
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("OtpRequest", otpRequestSchema);
