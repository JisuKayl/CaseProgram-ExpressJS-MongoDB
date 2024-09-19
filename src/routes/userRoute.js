const express = require("express");
const router = express.Router();
const authenticate = require("../middlewares/authenticate");
const userController = require("../controllers/userController");

// Get user data by access token
router.get(
  "/userAccessToken",
  authenticate,
  userController.getUserByAccessToken
);

//Route for refreshing access token
router.post("/refreshToken", userController.refreshAccessToken);

// Register a User
router.post("/signup", userController.signupUser);

// Sign-in a User
router.post("/login", userController.loginUser);

// Get All Users
router.get("/user", authenticate, userController.getAllUsers);

// Get User by ID
router.get("/user/:id", authenticate, userController.getUserById);

// Update User by ID
router.put("/user/:id/", authenticate, userController.updateUserById);

// Delete All Users
router.delete("/user", authenticate, userController.deleteAllUser);

// Delete User by ID
router.delete("/user/:id", authenticate, userController.deleteUserById);

module.exports = router;
