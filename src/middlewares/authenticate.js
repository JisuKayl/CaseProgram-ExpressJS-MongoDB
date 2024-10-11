require("dotenv").config();
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;
const Blacklist = require("../models/BlacklistModel");
const { setErrorMessage, getErrorMessage } = require("../utils/resLocalsUtil");

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      setErrorMessage(res, "Access Denied. No token provided.");
      return res.status(401).json({ message: getErrorMessage(res) });
    }

    const accessToken = authHeader.split(" ")[1];
    if (!accessToken) {
      setErrorMessage(res, "Access Denied. No token provided.");
      return res.status(401).json({ message: getErrorMessage(res) });
    }

    const checkIfBlacklisted = await Blacklist.findOne({ token: accessToken });
    if (checkIfBlacklisted) {
      setErrorMessage(res, "Session expired. Please login again.");
      return res.status(401).json({ message: getErrorMessage(res) });
    }

    const decoded = await jwt.verify(accessToken, JWT_SECRET);
    req.accessToken = accessToken;
    req.id = decoded.id;
    req.email = decoded.email;
    req.userRole = decoded.userRole;
    req.fullName = `${decoded.firstName} ${decoded.lastName}`;

    next();
  } catch (error) {
    setErrorMessage(
      res,
      "Token error. The provided token might be invalid or expired."
    );
    return res.status(400).json({ message: getErrorMessage(res) });
  }
};

module.exports = authenticate;
