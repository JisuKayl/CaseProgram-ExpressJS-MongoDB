const express = require("express");
const router = express.Router();
const User = require("../models/userdata");
const authenticate = require("../middleware/authenticate");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET;

// Get user data by access token
router.get("/userAccessToken", authenticate, (req, res) => {
  try {
    const accessToken = req.headers.authorization.split(" ")[1];
    const decodedAccessToken = jwt.decode(accessToken);
    return res
      .status(200)
      .json({ originalAccessToken: accessToken, decodedAccessToken });
  } catch (err) {
    res.status(400).json("Error 400: Bad request");
  }
});

//Route for refreshing access token
router.post("/refreshToken", (req, res) => {
  const refreshToken = req.cookies["refreshToken"];
  if (!refreshToken) {
    return res.status(401).send("Access Denied. No refresh token provided.");
  }

  try {
    const decoded = jwt.verify(refreshToken, JWT_SECRET);
    const accessToken = jwt.sign(
      { id: decoded.id, email: decoded.email, userRole: decoded.userRole },
      JWT_SECRET,
      { expiresIn: 5000 }
    );

    res
      .header("Authorization", accessToken)
      .send({ accessToken, refreshToken });
  } catch (error) {
    return res.status(400).send("Invalid refresh token.");
  }
});

// Register a User
router.post("/signup", async (req, res) => {
  const { password } = req.body;
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const userItem = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    age: req.body.age,
    contactNum: req.body.contactNum,
    username: req.body.username,
    email: req.body.email,
    password: hashedPassword,
    userRole: req.body.userRole,
    createdAt: new Date(),
  });

  try {
    const newUser = await userItem.save();

    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Sign-in a User
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const userExist = await User.findOne({ email });
    const accessToken = jwt.sign(
      {
        id: userExist._id,
        email: userExist.email,
        userRole: userExist.userRole,
      },
      JWT_SECRET,
      { expiresIn: 5000 }
    );
    const refreshToken = jwt.sign(
      {
        id: userExist._id,
        email: userExist.email,
        userRole: userExist.userRole,
      },
      JWT_SECRET,
      { expiresIn: "1d" }
    );
    const passwordMatch = await bcrypt.compare(password, userExist.password);
    if (!passwordMatch)
      return res.status(404).json({ message: "User not found" });
    return userExist.userRole == "Admin"
      ? res
          .cookie("refreshToken", refreshToken, {
            httpOnly: true,
            sameSite: "strict",
          })
          .header("Authorization", accessToken)
          .status(200)
          .send({ userExist, accessToken, refreshToken })
      : res
          .cookie("refreshToken", refreshToken, {
            httpOnly: true,
            sameSite: "strict",
          })
          .header("Authorization", accessToken)
          .status(200)
          .send({ userExist, accessToken, refreshToken });
  } catch (err) {
    res.status(404).json({ message: "User not found." });
  }
});

// Get All Users
router.get("/user", authenticate, async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get User by ID
router.get("/user/:id", authenticate, async (req, res) => {
  try {
    const userItem = await User.findById(req.params.id);
    if (!userItem) return res.status(404).json({ message: "User not found" });
    res.status(200).json(userItem);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update User by ID
router.put("/user/:id/", authenticate, async (req, res) => {
  try {
    const userItem = await User.findById(req.params.id);
    const { password } = req.body;
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    if (!userItem) return res.status(404).json({ message: "User not found" });

    // Update fields
    userItem.firstName = req.body.firstName || userItem.firstName;
    userItem.lastName = req.body.lastName || userItem.lastName;
    userItem.age = req.body.age || userItem.age;
    userItem.contactNum = req.body.contactNum || userItem.contactNum;
    userItem.username = req.body.username || userItem.username;
    userItem.email = req.body.email || userItem.email;
    userItem.password = hashedPassword;
    userItem.userRole = req.body.userRole || userItem.userRole;
    userItem.updatedAt = new Date();

    const updatedUser = await userItem.save();
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete User by ID
router.delete("/user/:id", authenticate, async (req, res) => {
  try {
    const userItem = await User.findById(req.params.id);
    if (!userItem) return res.status(404).json({ message: "User not found" });

    await userItem.deleteOne();
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete All Users
router.delete("/user", authenticate, async (req, res) => {
  try {
    await User.deleteMany();
    res.status(200).json({ message: "All users deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
