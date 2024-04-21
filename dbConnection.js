const mongoose = require("mongoose");

const URI = "mongodb://127.0.0.1:27017/E-LearningApp";

const dbConnection = async () => {
  try {
    await mongoose.connect(URI);
    console.log("DB Connected Successfully");
  } catch (error) {
    console.log("DB Connection Error:", error);
  }
};

module.exports = dbConnection;
