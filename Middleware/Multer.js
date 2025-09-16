const multer = require("multer");
const fs = require("fs");
const path = require("path");

// Dynamic storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = "others"; // default

    if (file.mimetype.startsWith("image/")) {
      folder = "photos";
    } else if (file.mimetype.startsWith("video/")) {
      folder = "videos";
    } else if (file.mimetype.startsWith("audio/")) {
      folder = "recordings";
    }

    const uploadPath = path.join(__dirname, `../uploads/${folder}`);
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// File filter (image / video / audio allowed)
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype.startsWith("image/") ||
    file.mimetype.startsWith("video/") ||
    file.mimetype.startsWith("audio/")
  ) {
    cb(null, true);
  } else {
    cb(new Error("Only image, video, or audio files allowed"));
  }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
