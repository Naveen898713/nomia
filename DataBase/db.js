const mongoose = require('mongoose');

const connectdb = async () => {
  const mongoURI = process.env.MONGO_URI; 

  if (!mongoURI) {
    console.error(" MONGO_URI is not defined in environment variables.");
    process.exit(1); 
  }

  try {
    await mongoose.connect(mongoURI);
    console.log("MongoDB Connected Successfully");
  } catch (error) {
    console.error(" MongoDB Connection Error:", error);
    process.exit(1);
  }
};

module.exports = connectdb;
