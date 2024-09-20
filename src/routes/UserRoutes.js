const express = require("express");
const router = express.Router();
const authenticate = require("../middlewares/authenticate");
const UserController = require("../controllers/UserController");

// Get user data by access token
router.get("/accessToken", authenticate, UserController.accessToken);

//Route for refreshing access token
router.post("/refreshToken", UserController.refreshToken);

// Register a User
router.post("/signup", UserController.signup);

// Sign-in a User
router.post("/login", UserController.login);

// Get All Users
router.get("/users", authenticate, UserController.getAllUsers);

// Get User by ID
router.get("/user/:id", authenticate, UserController.getUserById);

// Update User by ID
router.put("/user/:id/", authenticate, UserController.updateUserById);

// Delete All Users
router.delete("/user", authenticate, UserController.deleteAllUsers);

// Delete User by ID
router.delete("/user/:id", authenticate, UserController.deleteUserById);

module.exports = router;
