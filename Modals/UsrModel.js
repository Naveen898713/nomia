// models/User.js
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  dateOfBirth: { type: Date, required: true },
  gender: { type: String, enum: ["male", "female", "other"], required: true },
  number: { type: String, required: true },
  nominee: { type: String, required: true },
  otp: { type: String, },
  photo: { type: String }, // photo ka URL ya path store hoga
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);
