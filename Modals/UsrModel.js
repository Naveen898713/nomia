// models/User.js
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, },  // ✅ unique + sparse
  dateOfBirth: { type: Date, required: true },
  gender: { type: String, enum: ["male", "female", "other"], required: true },
  number: { type: String, required: true, unique: true }, // ✅ unique
  nomineeOne: { type: String },
  nomineeSec: { type: String },
  otp: { type: String },
  countryCode:{type:String},
  photo: { type: String },
}, { timestamps: true });

module.exports = mongoose.model("newUser", UserSchema);
