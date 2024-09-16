const mongoose = require("mongoose");

const caseSchema = mongoose.Schema({
  // _id: mongoose.Schema.ObjectId,
  // id: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   required: false,
  // },
  fileNumber: {
    type: String,
    required: true,
  },
  caseTitle: {
    type: String,
    required: true,
  },
  caseNumber: {
    type: Number,
    required: true,
  },
  caseStatus: {
    type: String,
    enum: ["ACTIVE", "RESOLVED", "TERMINATED", "ARCHIVED"],
    required: true,
  },
  kindOfCase: {
    type: String,
    required: true,
  },
  courtCase: {
    type: String,
    required: true,
  },
  engagedDate: {
    type: Date,
    required: false,
  },
  location: {
    type: String,
    required: true,
  },
  clientName: {
    type: String,
    required: true,
  },
  hearings: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Hearing",
      required: false,
    },
  ],
});

const caseData = mongoose.model("Case", caseSchema);
module.exports = caseData;
