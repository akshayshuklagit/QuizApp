const express = require("express");
const dbConnection = require("./db/dbConnection");
const User = require("./models/userSchema");
const cors = require("cors")
const PORT = 5000;
const app = express();
app.use(express.json());
app.use(cors())

app.get("/users", async (req, res) => {
  const users = await User.find({});
  res.status(200).json(users);
});

app.post("/signup", async (req, res) => {
  try {
    const userExist = await User.findOne({ email: req.body.email });
    if (!userExist) {
      await User.create(req.body);
      res.status(201).json({ message: "User Registration Successfull", success:true });
    } else {
      res.status(200).json({ message: "User already exist with this email", success:false });
    }
  } catch (error) {
    console.log("Sign Up Error:", error);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const userExist = await User.findOne({ email, password });
    if (userExist) {
      res.status(200).json({ message: "Login successfull", success:true, user: userExist  });
    } else {
      res.status(404).json({ message: "Invalid email or password", success:false  });
    }
  } catch (error) {
    console.log("Login Error:", error);
  }
});

app.patch("/test", async (req, res) => {
  
  try {
    const testData = {
      testID: req.body.testID,
      category: req.body.category,
      score: req.body.score,
      correctQuestions: req.body.correctQuestions,
      wrongQuestions: req.body.wrongQuestions,
      time: req.body.time,
    };
   
    const response = await User.updateOne(
      { email: req.body.email },
      { $push: { tests: testData } }
    );

    if (response.modifiedCount > 0)
      res.status(200).json({ message: "Test submitted successfully" });
    else res.status(200).json({ message: "User not found" });
  } catch (error) {
    console.log("Test Submit Error:", error);
  }
});

dbConnection()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Listening on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
