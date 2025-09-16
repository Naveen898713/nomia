const express = require("express");
// const upload = require("../../Middleware/videoMulter");
const { uploadVideo, getVideos, deleteVideo } = require("../../Controllers/Videos/VideoController");
const upload = require("../../Middleware/Multer");
const router = express.Router();


// Upload video
router.post("/upload", upload.single("video"), uploadVideo);

// Get all videos
router.get("/get", getVideos);

// Delete video t
router.delete("delete/:id", deleteVideo);

module.exports = router;
