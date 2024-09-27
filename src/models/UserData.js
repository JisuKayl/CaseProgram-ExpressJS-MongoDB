const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "Please enter your first name."],
    },
    lastName: {
      type: String,
      required: [true, "Please enter your last name."],
    },
    age: {
      type: Number,
      required: [true, "Please enter your age."],
    },
    contactNum: {
      type: Number,
      required: false,
      unique: [true, "Contact number already exist."],
      dropDups: true,
      minLength: [11, "Contact number must be 11 numerical inputs."],
      maxLength: [11, "Contact number must be 11 numerical inputs."],
    },
    username: {
      type: String,
      required: [true, "Please enter your username."],
      unique: [true, "Username already exist."],
      dropDups: true,
    },
    email: {
      type: String,
      required: [true, "Please enter your email."],
      unique: [true, "Email already exist."],
      dropDups: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Please enter your password."],
      minLength: [6, "Password must atleast have six(6) characters."],
      trim: true,
    },
    userRole: {
      type: String,
      enum: ["Admin", "User"],
      required: true,
    },
    createdAt: {
      type: Date,
    },
    updatedAt: {
      type: Date,
    },
    // lastLoggedAt: {
    //   type: Date,
    // },
    //   isUserEnabled: {
    //     type: Boolean,
    //     required: true,
    //   },
  }
  // {
  //   timestamps: {
  //     createdAt: "created_at",
  //     updatedAt: "updated_at",
  //   },
  // }
);

const userData = mongoose.model("User", userSchema);
module.exports = userData;
