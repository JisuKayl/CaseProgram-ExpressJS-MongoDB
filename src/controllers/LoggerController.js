const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");

const Log = mongoose.model(
  "Log",
  new mongoose.Schema({}, { strict: false }),
  "activityLogs"
);

exports.getAllActivityLogs = asyncHandler(async (req, res, next) => {
  try {
    const logs = await Log.find().sort({ timestamp: 1 });
    res.json(logs);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to retrieve logs", error: err.message });
  }
});
