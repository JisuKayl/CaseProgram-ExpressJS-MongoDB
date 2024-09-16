const express = require("express");
const router = express.Router();
const User = require("../models/userdata");

// Get All User
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get User by ID
router.get("/:id", async (req, res) => {
  try {
    const userItem = await User.findById(req.params.id);
    if (!userItem) return res.status(404).json({ message: "User not found" });
    res.status(200).json(userItem);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a User
router.post("/", async (req, res) => {
  const userItem = new User({
    userFirstName: req.body.userFirstName,
    userLastName: req.body.userLastName,
    userName: req.body.userName,
    userEmail: req.body.userEmail,
    userPassword: req.body.userPassword,
  });

  try {
    const newUser = await userItem.save();

    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update User by ID
router.put("/:id/", async (req, res) => {
  try {
    const userItem = await User.findById(req.params.id);
    if (!userItem) return res.status(404).json({ message: "User not found" });

    // Update fields
    userItem.userFirstName = req.body.userFirstName || userItem.userFirstName;
    userItem.userLastName = req.body.userFirstName || userItem.userLastName;
    userItem.userName = req.body.userFirstName || userItem.userName;
    userItem.userEmail = req.body.userFirstName || userItem.userEmail;
    userItem.userPassword = req.body.userFirstName || userItem.userPassword;

    const updatedUser = await userItem.save();
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete User by ID
router.delete("/:id", async (req, res) => {
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
router.delete("/", async (req, res) => {
  try {
    await User.deleteMany();
    res.status(200).json({ message: "All users deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
