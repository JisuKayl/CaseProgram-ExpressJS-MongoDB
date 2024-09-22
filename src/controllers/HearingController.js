const Hearing = require("../models/HearingData");
const asyncHandler = require("express-async-handler");

exports.getAllHearings = asyncHandler(async (req, res, next) => {
  try {
    const hearings = await Hearing.find().populate("caseId");
    res.status(200).json(hearings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

exports.getHearingById = asyncHandler(async (req, res, next) => {
  try {
    const hearingItem = await Hearing.findById(req.params.id).populate(
      "caseId"
    );
    if (!hearingItem)
      return res.status(404).json({ message: "Hearing not found" });
    res.status(200).json(hearingItem);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

exports.createHearing = asyncHandler(async (req, res, next) => {
  const hearingItem = new Hearing({
    hearingName: req.body.hearingName,
    hearingDate: req.body.hearingDate,
    hearingNumber: req.body.hearingNumber,
    caseId: req.body.caseId,
  });

  try {
    const newHearing = await hearingItem.save();

    res.status(201).json(newHearing);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

exports.updateHearingById = asyncHandler(async (req, res, next) => {
  try {
    const hearingItem = await Hearing.findById(req.params.id);
    if (!hearingItem)
      return res.status(404).json({ message: "Hearing not found" });

    // Update fields
    hearingItem.hearingName = req.body.hearingName || hearingItem.hearingName;
    hearingItem.hearingDate = req.body.hearingDate || hearingItem.hearingDate;
    hearingItem.hearingNumber =
      req.body.hearingNumber || hearingItem.hearingNumber;

    const updatedHearing = await hearingItem.save();
    res.status(200).json(updatedHearing);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

exports.deleteAllHearings = asyncHandler(async (req, res, next) => {
  try {
    await Hearing.deleteMany();
    res.status(200).json({ message: "All hearings deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

exports.deleteHearingByID = asyncHandler(async (req, res, next) => {
  try {
    const hearingItem = await Hearing.findById(req.params.id);
    if (!hearingItem)
      return res.status(404).json({ message: "Hearing not found" });

    await hearingItem.deleteOne();
    res.status(200).json({ message: "Hearing deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
