const mongoose = require("mongoose");

const caseSchema = mongoose.Schema({
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
    type: mongoose.Schema.ObjectId,
    ref: "User",
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
