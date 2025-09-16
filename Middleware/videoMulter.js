// const multer = require("multer");
// const path = require("path");

// // Storage config
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/videos");
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname));
//   }
// });

// // File filter (allow only videos)
// const fileFilter = (req, file, cb) => {
//   const allowedTypes = /mp4|mkv|avi|mov|wmv|flv|webm/;
//   const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
//   if (extname) {
//     return cb(null, true);
//   } else {
//     cb(new Error("Only video files are allowed"));
//   }
// };

// const upload = multer({ storage, fileFilter });
// module.exports = upload;


const multer = require("multer");
const fs = require("fs");
const path = require("path");

// Storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../uploads/videos");
    fs.mkdirSync(uploadPath, { recursive: true }); // ensure folder exists
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// File filter (allow ANY video type)
const fileFilter = (req, file, cb) => {
  console.log("Uploaded File =>", file.mimetype, file.originalname);

  if (file.mimetype.startsWith("video/")) {
    cb(null, true); // ✅ accept any video
  } else {
    cb(new Error("Only video files are allowed"));
  }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
