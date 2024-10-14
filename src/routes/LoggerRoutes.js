const express = require("express");
const router = express.Router();
const authenticate = require("../middlewares/authenticate");
const LoggerController = require("../controllers/LoggerController");

// Get All Activity Logs
router.get("/activityLogs", authenticate, LoggerController.getAllActivityLogs);

module.exports = router;
