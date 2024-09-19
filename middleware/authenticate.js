require("dotenv").config();
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

//Authentication middleware function
const authenticate = async (req, res, next) => {
  try {
    const accessToken = req.headers["authorization"].split(" ")[1];
    // const refreshToken = req.cookies["refreshToken"];
    if (accessToken == "" || null || undefined) {
      return res.status(401).send("Access Denied. No token provided.");
    }
    console.log(accessToken);

    const decoded = await jwt.verify(accessToken, JWT_SECRET);
    req.accessToken = accessToken;
    req.id = decoded.id;
    req.email = decoded.email;
    req.userRole = decoded.userRole;

    next();
  } catch (error) {
    return res
      .status(400)
      .send("Token error. The provided token might be invalid or expired.");
  }
};

module.exports = authenticate;
