const User = require("../models/UserModel");
const Blacklist = require("../models/BlacklistModel");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { serialize } = require("cookie");
require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET;
const { infoLogger, errorLogger } = require("../config/logger");

exports.accessToken = asyncHandler(async (req, res, next) => {
  try {
    const accessToken = req.headers.authorization.split(" ")[1];
    const decodedAccessToken = jwt.verify(accessToken, JWT_SECRET);
    return res
      .status(200)
      .json({ originalAccessToken: accessToken, decodedAccessToken });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

exports.refreshToken = asyncHandler(async (req, res, next) => {
  const refreshToken = req.cookies["refreshToken"];
  if (!refreshToken) {
    return res
      .status(401)
      .json({ message: "Access Denied. No refresh token provided." });
  }

  try {
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

    res.header("Authorization", accessToken).json({ accessToken });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
});

exports.signup = asyncHandler(async (req, res, next) => {
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

exports.login = asyncHandler(async (req, res, next) => {
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
    const passwordMatch = await bcrypt.compare(password, userExist.password);
    if (!passwordMatch)
      return (
        errorLogger.error("A user failed to login") &&
        res.status(404).json({ message: "User not found" })
      );
    return userExist.userRole == "Admin"
      ? infoLogger.info(
          `${userExist.username} successfully logged in as ${userExist.userRole}`
        ) &&
          res
            .cookie("refreshToken", refreshToken, {
              httpOnly: true,
              secure: true,
              sameSite: "strict",
            })
            .header("Authorization", accessToken)
            .status(200)
            .json({ userExist, accessToken })
      : infoLogger.info(
          `${userExist.username} successfully logged in as ${userExist.userRole}`
        ) &&
          res
            .cookie("refreshToken", refreshToken, {
              httpOnly: true,
              secure: true,
              sameSite: "strict",
            })
            .header("Authorization", accessToken)
            .status(200)
            .json({ userExist, accessToken });
  } catch (err) {
    errorLogger.error("A user failed to login") &&
      res.status(404).json({ message: err.message });
  }
});

exports.logout = asyncHandler(async (req, res) => {
  const accessToken = req.headers["authorization"].split(" ")[1];
  const blacklistItem = new Blacklist({
    token: accessToken,
  });

  await blacklistItem.save();

  const serializedJWT = serialize("refreshToken", true, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: -1,
  });

  res.setHeader("Set-Cookie", serializedJWT);
  res.clearCookie("refreshToken");
  res.status(200).json({
    response: {
      code: 200,
      description: "Logged out successfully",
    },
  });
});

exports.getAllUsers = asyncHandler(async (req, res, next) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

exports.getUserById = asyncHandler(async (req, res, next) => {
  try {
    const userItem = await User.findById(req.params.id);
    if (!userItem) return res.status(404).json({ message: "User not found" });
    res.status(200).json(userItem);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

exports.updateUserById = asyncHandler(async (req, res, next) => {
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

exports.deleteAllUsers = asyncHandler(async (req, res, next) => {
  try {
    await User.deleteMany();
    res.status(200).json({ message: "All users deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

exports.deleteUserById = asyncHandler(async (req, res, next) => {
  try {
    const userItem = await User.findById(req.params.id);
    if (!userItem) return res.status(404).json({ message: "User not found" });

    await userItem.deleteOne();
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
