const PhotoModel = require("../../Modals/photo/PhotoModel");


module.exports.uploadPhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "Photo is required" });
    }

    const { description } = req.body;

    const photo = new PhotoModel({
      photo: `/uploads/photos/${req.file.filename}`,
      description,
    });

    await photo.save();

    res.status(200).json({
      success: true,
      message: "Photo uploaded successfully",
      data: photo,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// ✅ Get All Photos
exports.getPhotos = async (req, res) => {
  try {
    const photos = await PhotoModel.find().sort({ createdAt: -1 }); // latest first
    res.status(200).json({
      success: true,
      count: photos.length,
      data: photos,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

    
