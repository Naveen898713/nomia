// controllers/userController.js

const UsrModel = require("../../Modals/UsrModel");


module.exports.registerUser = async (req, res) => {
  try {
    const { name, email, dateOfBirth, gender, nominee1, nominee2 } = req.body;

    if (!name || !email || !dateOfBirth || !gender || !nominee1 || !nominee2) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const userExists = await UsrModel.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: "Email already registered" });
    }

    const newUser = new UsrModel({
      name,
      email,
      dateOfBirth,
      gender,
      nominee1,
      nominee2,
      photo: req.file ? req.file.path : null, // multer se file aayegi
    });

    await newUser.save();

    res.status(201).json({ success: true, message: "User registered successfully", data: newUser });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// Get user by ID
module.exports.getUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await UsrModel.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



// controllers/userController.js

module.exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, dateOfBirth, gender, nominee1, nominee2 } = req.body;

    // New data object
    const updatedData = {
      name,
      dateOfBirth,
      gender,
      nominee1,
      nominee2,
    };

    // If photo uploaded, add it
    if (req.file) {
      updatedData.photo = req.file.path;
    }

    const user = await UsrModel.findByIdAndUpdate(id, updatedData, { new: true });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, message: "User updated successfully", data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
