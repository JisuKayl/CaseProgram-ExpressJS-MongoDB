const User = require("../models/UserModel");
const Blacklist = require("../models/BlacklistModel");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { serialize } = require("cookie");
require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET;
const {
  setSuccessMessage,
  setErrorMessage,
  getSuccessMessage,
  getErrorMessage,
} = require("../utils/resLocalsUtil");

exports.accessToken = asyncHandler(async (req, res, next) => {
  try {
    const accessToken = req.headers.authorization.split(" ")[1];
    const decodedAccessToken = jwt.verify(accessToken, JWT_SECRET);
    setSuccessMessage(res, "Successfully fetched user by token.");
    return res
      .status(200)
      .json({
        originalAccessToken: accessToken,
        decodedAccessToken,
        message: getSuccessMessage(res),
      });
  } catch (err) {
    setErrorMessage(res, "Failed to fetch user by token.");
    res.status(400).json({ message: getErrorMessage(res) });
  }
});

exports.refreshToken = asyncHandler(async (req, res, next) => {
  try {
    const refreshToken = req.cookies["refreshToken"];
    if (!refreshToken) {
      setErrorMessage(res, "Access denied. No refresh token provided.");
      return res.status(401).json({ message: getErrorMessage(res) });
    }

    const decodedRefreshToken = jwt.verify(refreshToken, JWT_SECRET);
    const accessToken = jwt.sign(
      {
        id: decodedRefreshToken.id,
        email: decodedRefreshToken.email,
        userRole: decodedRefreshToken.userRole,
      },
      JWT_SECRET,
      { expiresIn: "1h" }
    );
    setSuccessMessage(res, "Refresh token successfully validated.");
    res
      .header("Authorization", accessToken)
      .status(200)
      .json({ accessToken, message: getErrorMessage(res) });
  } catch (err) {
    setErrorMessage(res, err.message);
    return res.status(400).json({ message: getErrorMessage(res) });
  }
});

exports.signup = asyncHandler(async (req, res, next) => {
  try {
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

    const newUser = await userItem.save();

    setSuccessMessage(res, "Account registered successfully.");
    res.status(201).json({ newUser, message: getSuccessMessage(res) });
  } catch (err) {
    setErrorMessage(res, "Failed to sign up an account");
    res.status(400).json({ message: getErrorMessage(res) });
  }
});

exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const userExist = await User.findOne({ email });
    if (!userExist) {
      setErrorMessage(res, "User not found");
      return res.status(404).json({ message: getErrorMessage(res) });
    }

    const passwordMatch = await bcrypt.compare(password, userExist.password);
    if (!passwordMatch) {
      setErrorMessage(res, "Incorrect password");
      return res.status(401).json({ message: getErrorMessage(res) });
    }

    const accessToken = jwt.sign(
      {
        id: userExist._id,
        email: userExist.email,
        userRole: userExist.userRole,
      },
      JWT_SECRET,
      { expiresIn: "1h" }
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

    setSuccessMessage(
      res,
      `${userExist.username} successfully logged in as ${userExist.userRole}`
    );
    return res
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
      })
      .header("Authorization", accessToken)
      .status(200)
      .json({ userExist, accessToken, message: getSuccessMessage(res) });
  } catch (err) {
    setErrorMessage(res, "An error occurred during login");
    return res.status(500).json({ message: getErrorMessage(res) });
  }
});

exports.logout = asyncHandler(async (req, res) => {
  const accessToken = req.headers["authorization"].split(" ")[1];
  const blacklistItem = new Blacklist({ token: accessToken });

  await blacklistItem.save();

  const serializedJWT = serialize("refreshToken", true, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: -1,
  });

  res.setHeader("Set-Cookie", serializedJWT);
  res.clearCookie("refreshToken");

  setSuccessMessage(res, "Logged out successfully");
  res.status(200).json({ message: getSuccessMessage(res) });
});

exports.getAllUsers = asyncHandler(async (req, res, next) => {
  try {
    const users = await User.find();
    setSuccessMessage(res, "Fetched all users successfully.");
    res.status(200).json({ users, message: getSuccessMessage(res) });
  } catch (err) {
    setErrorMessage(res, err.message);
    res.status(500).json({ message: getErrorMessage(res) });
  }
});

exports.getUserById = asyncHandler(async (req, res, next) => {
  try {
    const userItem = await User.findById(req.params.id);
    if (!userItem) {
      setErrorMessage(res, "User not found");
      return res.status(404).json({ message: getErrorMessage(res) });
    }
    setSuccessMessage(res, "User retrieved successfully.");
    res.status(200).json({ userItem, message: getSuccessMessage(res) });
  } catch (err) {
    setErrorMessage(res, err.message);
    res.status(500).json({ message: getErrorMessage(res) });
  }
});

exports.updateUserById = asyncHandler(async (req, res, next) => {
  try {
    const userItem = await User.findById(req.params.id);
    if (!userItem) {
      setErrorMessage(res, "User not found");
      return res.status(404).json({ message: getErrorMessage(res) });
    }

    const { password } = req.body;
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

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
    setSuccessMessage(res, "User updated successfully.");
    res.status(200).json({ updatedUser, message: getSuccessMessage(res) });
  } catch (err) {
    setErrorMessage(res, err.message);
    res.status(400).json({ message: getErrorMessage(res) });
  }
});

exports.deleteAllUsers = asyncHandler(async (req, res, next) => {
  try {
    await User.deleteMany();
    setSuccessMessage(res, "All users deleted successfully");
    res.status(200).json({ message: getSuccessMessage(res) });
  } catch (err) {
    setErrorMessage(res, err.message);
    res.status(500).json({ message: getErrorMessage(res) });
  }
});

exports.deleteUserById = asyncHandler(async (req, res, next) => {
  try {
    const userItem = await User.findById(req.params.id);
    if (!userItem) {
      setErrorMessage(res, "User not found");
      return res.status(404).json({ message: getErrorMessage(res) });
    }

    await userItem.deleteOne();
    setSuccessMessage(res, "User deleted successfully.");
    res.status(200).json({ message: getSuccessMessage(res) });
  } catch (err) {
    setErrorMessage(res, err.message);
    res.status(500).json({ message: getErrorMessage(res) });
  }
});
