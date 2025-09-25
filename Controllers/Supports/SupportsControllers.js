const jwt = require("jsonwebtoken");

const UsrModel = require("../../Modals/UsrModel");
const SupportsModel = require("../../Modals/SupportForHelp/SupportsModel");
const JWT_SECRET = process.env.JWT_SECRET;

// Save description with userId & name from token
module.exports.AddHelpSupport = async (req, res) => {
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
    const { description } = req.body;
    if (!description) {
      return res.status(400).json({ success: false, message: "Description is required" });
    }

    // 5. Save in DB
    const newDescription = new SupportsModel({
      userId: user._id,
      name: user.name,
      description
    });

    await newDescription.save();

    return res.status(201).json({
      success: true,
      message: "Description saved successfully",
      data: newDescription
    });

  } catch (error) {
    console.error("Add Description error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};




// Get all descriptions
module.exports.getAllSupportOfHelp = async (req, res) => {
  try {
    const descriptions = await SupportsModel.find().sort({ createdAt: -1 });

    if (!descriptions || descriptions.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No descriptions found",
      });
    }

    return res.status(200).json({
      success: true,
      count: descriptions.length,
      data: descriptions,
    });
  } catch (error) {
    console.error("Get All Descriptions error:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
