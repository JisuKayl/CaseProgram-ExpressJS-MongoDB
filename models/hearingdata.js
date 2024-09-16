const mongoose = require("mongoose");

const hearingSchema = mongoose.Schema({
  // _id: mongoose.Schema.ObjectId,
  // id: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   required: false,
  // },
  hearingName: {
    type: String,
    required: true,
  },
  hearingDate: {
    type: Date,
    required: true,
  },
  hearingNumber: {
    type: Number,
    required: true,
  },
  caseId: {
    type: mongoose.Schema.ObjectId,
    ref: "Case",
    required: true,
  },
});

const hearingData = mongoose.model("Hearing", hearingSchema);
module.exports = hearingData;
