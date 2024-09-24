const mongoose = require("mongoose");

const blacklistSchema = mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true,
  },
  loggedOutAt: {
    type: Date,
    default: Date.now,
    // expires: "1h",
  },
});

const blacklistData = mongoose.model("Blacklist", blacklistSchema);

module.exports = blacklistData;
