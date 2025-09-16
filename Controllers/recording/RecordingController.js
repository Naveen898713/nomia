const RecordingModel = require("../../Modals/Recording/RecordingModel");

module.exports.uploadRecording = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "Recording file is required" });
    }

    const { description } = req.body;

    const recording = new RecordingModel({
      recording: `/uploads/recordings/${req.file.filename}`,
      description,
    });

    await recording.save();

    res.status(201).json({
      success: true,
      message: "Recording uploaded successfully",
      data: recording,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get All Recordings
module.exports.getRecordings = async (req, res) => {
  try {
    const recordings = await RecordingModel.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: recordings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Delete Recording
module.exports.deleteRecording = async (req, res) => {
  try {
    const { id } = req.params;

    const recording = await RecordingModel.findByIdAndDelete(id);

    if (!recording) {
      return res.status(404).json({ success: false, message: "Recording not found" });
    }

    res.status(200).json({
      success: true,
      message: "Recording deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
