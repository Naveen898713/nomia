const mongoose = require("mongoose");

const recordingSchema = new mongoose.Schema(
  {
    recording: {
      type: String, // file path
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Recording", recordingSchema);
