// Models/Photo.js
const mongoose = require("mongoose");

const photoSchema = new mongoose.Schema({
  photo: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model("Photo", photoSchema);

