// models/User.js
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  dateOfBirth: { type: Date, required: true },
  gender: { type: String, enum: ["male", "female", "other"], required: true },
  nominee1: { type: String, required: true },
  nominee2: { type: String, required: true },
  photo: { type: String }, // photo ka URL ya path store hoga
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);
