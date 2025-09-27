const mongoose = require("mongoose");

const ProblemsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
    type: {
    type: String,
 
  }
}, { timestamps: true });

module.exports = mongoose.model("Problems", ProblemsSchema);
