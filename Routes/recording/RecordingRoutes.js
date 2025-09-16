const express = require("express");
const upload = require("../../Middleware/Multer");
const { getRecordings, deleteRecording, uploadRecording } = require("../../Controllers/recording/RecordingController");
const router = express.Router();


// Upload Recording
router.post("/upload", upload.single("recording"), uploadRecording);

// Get All Recordings
router.get("/all-recording", getRecordings);

// Delete Recording
router.delete("/delete/:id", deleteRecording);

module.exports = router;
