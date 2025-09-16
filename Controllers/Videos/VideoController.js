
const fs = require("fs");
const path = require("path");
const VideoModel = require("../../Modals/videos/VideoModel");

// Upload Video
// module.exports.uploadVideo = async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ success: false, message: "Video file is required" });
//     }

//     const { description } = req.body;

//     const newVideo = new VideoModel({
//       video: req.file.filename,
//       description
//     });

//     await newVideo.save();

//     res.status(201).json({ success: true, message: "Video uploaded successfully", data: newVideo });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// your mongoose model

// Upload video
module.exports.uploadVideo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "Video file is required" });
    }

    const { description } = req.body;

    const video = new VideoModel({
      videoUrl: `/uploads/videos/${req.file.filename}`,
      description,
    });

    await video.save();

    res.status(200).json({
      success: true,
      message: "Video uploaded successfully",
      data: video,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// Get All Videos
module.exports.getVideos = async (req, res) => {
  try {
    const videos = await VideoModel.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: videos });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete Video
module.exports.deleteVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const video = await VideoModel.findById(id);

    if (!video) {
      return res.status(404).json({ success: false, message: "Video not found" });
    }

    // Delete file from uploads
    const filePath = path.join(__dirname, "../uploads/videos", video.video);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await VideoModel.findByIdAndDelete(id);

    res.status(200).json({ success: true, message: "Video deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
