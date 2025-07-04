const express = require("express")
const router = express.Router()
const User = require("../models/user.js");
const bcrypt = require("bcrypt");


//sign up 

router.get("/sign-up", (req, res) => {
  res.render("auth/sign-up.ejs");
});


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

    req.session.user = {
    username: user.username,
    };

    req.session.save(() => {
    res.redirect("/");
    });

  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error.");
  }
});

//handling sign in 

router.get("/sign-in", (req, res) => {
  res.render("auth/sign-in.ejs");
});

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
   req.session.user = {
    username: userInDatabase.username,
    _id: userInDatabase._id
  };
  
 req.session.save(() => {
  res.redirect("/");
});
});

// handling signing out

router.get("/sign-out", (req, res) => {
  req.session.destroy(() => {
  res.redirect("/");
    });
  console.log("signout works");
  
});


module.exports= router