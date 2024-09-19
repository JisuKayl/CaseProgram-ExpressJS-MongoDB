//Connection to Mongo DB
const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/case_db");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

module.exports = db;
