const express = require("express")
const router = express.Router()
const User = require("../models/user.js");
const bcrypt = require("bcrypt");


//sign up 
router.post("/sign-up", async (req, res) => {
  try {
    const { username, password, confirmPassword } = req.body;
    const userInDatabase = await User.findOne({ username });

    if (userInDatabase) {
      return res.send("Username already taken.");
    }

    if (password !== confirmPassword) {
      return res.send("Password and Confirm Password must match");
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const user = await User.create({ username, password: hashedPassword });

    res.send(`Thanks for signing up, ${user.username}!`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error.");
  }
});

//handling sign up 
router.post("/sign-in", async (req, res) => {
    
    const userInDatabase = await User.findOne({ username: req.body.username });
if (!userInDatabase) {
  return res.send("Login failed. Please try again.");
}

const validPassword = bcrypt.compareSync(
  req.body.password,
  userInDatabase.password
);
if (!validPassword) {
  return res.send("Login failed. Please try again.");
}
  res.send("Request to sign in received!");
});


module.exports= router