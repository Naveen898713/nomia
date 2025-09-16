
const express = require("express");

const { uploadPhoto, getPhotos } = require("../../Controllers/Photos/PhotoControllers");
const upload = require("../../Middleware/Multer");
// const upload = require("../../Middleware/Photoupload");
const router = express.Router();


router.post("/upload", upload.single("photo"), uploadPhoto);
router.get("/get-all", getPhotos);

module.exports = router;
