const jwt = require("jsonwebtoken");

const UsrModel = require("../../Modals/UsrModel");
const ProblemsModel = require("../../Modals/Problems/ProblemsModel");

const JWT_SECRET = process.env.JWT_SECRET;

// Save description with userId & name from token
module.exports.AddProblems = async (req, res) => {
  try {
    // 1. Token uthao
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      return res.status(401).json({ success: false, message: "Authorization header missing" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ success: false, message: "Token missing" });
    }

    // 2. Token verify
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ success: false, message: "Invalid or expired token" });
    }

    // 3. User find
    const user = await UsrModel.findById(decoded.userId).select("name");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // 4. Get description from req.body
    const { description ,type } = req.body;
    if (!description) {
      return res.status(400).json({ success: false, message: "Description is required" });
    }

    // 5. Save in DB
    const newProblem = new ProblemsModel({
      userId: user._id,
      name: user.name,
      description
    });

    await newProblem.save();

    return res.status(201).json({
      success: true,
      message: "Add Problem saved successfully",
      data: newProblem
    });

  } catch (error) {
    console.error("Add Problems error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};




// Get all descriptions
module.exports.getAllProblems = async (req, res) => {
  try {
    const Problems = await ProblemsModel.find().sort({ createdAt: -1 });

    if (!Problems || Problems.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No Problems found",
      });
    }

    return res.status(200).json({
      success: true,
      count: Problems.length,
      data: Problems,
    });
  } catch (error) {
    console.error("Get all Problems error:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
