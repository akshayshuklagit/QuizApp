const mongoose = require("mongoose");

const testSchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now(),
  },
  testID: Number,
  category: String,
  score: Number,
  correctQuestions: Number,
  wrongQuestions: Number,
  time: String,
});

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  tests: [testSchema],
});

const User = mongoose.model("User", userSchema);

module.exports = User;
