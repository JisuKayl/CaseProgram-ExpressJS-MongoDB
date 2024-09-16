const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  // _id: mongoose.Schema.ObjectId,
  // id: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   required: false,
  // },
  userFirstName: {
    type: String,
    required: true,
  },
  userLastName: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  userEmail: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  userPassword: {
    type: String,
    required: true,
  },
  //   isUserEnabled: {
  //     type: Boolean,
  //     required: true,
  //   }
});

const userData = mongoose.model("User", userSchema);
module.exports = userData;
