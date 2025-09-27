// routes/otpRoutes.js
const express = require("express");
const { AddProblems, getAllProblems } = require("../../Controllers/Problems/Problems");



const router = express.Router();

router.post("/add",AddProblems);
router.get("/get-all", getAllProblems);


module.exports = router;
