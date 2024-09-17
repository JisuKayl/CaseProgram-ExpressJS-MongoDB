const express = require("express");
const router = express.Router();
const User = require("../models/userdata");
const bcrypt = require("bcrypt");

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
    const passwordMatch = await bcrypt.compare(password, userExist.password);
    if (!passwordMatch)
      return res.status(404).json({ message: "User not found" });
    return userExist.userRole == "Admin"
      ? res
          .status(200)
          .json([
            "WELCOME TO ADMIN PAGE",
            `Good day, ${userExist.firstName} ${userExist.lastName}`,
            userExist,
          ])
      : res
          .status(200)
          .json([
            "WELCOME TO USER PAGE",
            `Good day, ${userExist.firstName} ${userExist.lastName}`,
            userExist,
          ]);
  } catch (err) {
    res.status(404).json({ message: "User not found" });
  }
});

// Get All Users
router.get("/user", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get User by ID
router.get("/user/:id", async (req, res) => {
  try {
    const userItem = await User.findById(req.params.id);
    if (!userItem) return res.status(404).json({ message: "User not found" });
    res.status(200).json(userItem);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update User by ID
router.put("/user/:id/", async (req, res) => {
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
router.delete("/user/:id", async (req, res) => {
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
router.delete("/user", async (req, res) => {
  try {
    await User.deleteMany();
    res.status(200).json({ message: "All users deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
