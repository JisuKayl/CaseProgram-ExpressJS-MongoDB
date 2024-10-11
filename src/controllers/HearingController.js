const Hearing = require("../models/HearingModel");
const asyncHandler = require("express-async-handler");
const {
  setSuccessMessage,
  setErrorMessage,
  getSuccessMessage,
  getErrorMessage,
} = require("../utils/resLocalsUtil");

exports.getAllHearings = asyncHandler(async (req, res, next) => {
  try {
    const hearings = await Hearing.find().populate("caseId");
    setSuccessMessage(res, "Fetched all hearings successfully.");
    res.status(200).json({ hearings, message: getSuccessMessage(res) });
  } catch (err) {
    setErrorMessage(res, err.message);
    res.status(500).json({ message: getErrorMessage(res) });
  }
});

exports.getHearingById = asyncHandler(async (req, res, next) => {
  try {
    const hearingItem = await Hearing.findById(req.params.id).populate(
      "caseId"
    );
    if (!hearingItem) {
      setErrorMessage(res, "Hearing not found.");
      return res.status(404).json({ message: getErrorMessage(res) });
    }
    setSuccessMessage(res, "Hearing retrieved successfully.");
    res.status(200).json({ hearingItem, message: getSuccessMessage(res) });
  } catch (err) {
    setErrorMessage(res, err.message);
    res.status(500).json({ message: getErrorMessage(res) });
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
    setSuccessMessage(res, "Hearing created successfully.");
    res.status(201).json({ newHearing, message: getSuccessMessage(res) });
  } catch (err) {
    setErrorMessage(res, "Failed to create hearing.");
    res.status(400).json({ message: getErrorMessage(res) });
  }
});

exports.updateHearingById = asyncHandler(async (req, res, next) => {
  try {
    const hearingItem = await Hearing.findById(req.params.id);
    if (!hearingItem) {
      setErrorMessage(res, "Hearing not found.");
      return res.status(404).json({ message: getErrorMessage(res) });
    }

    // Update fields
    hearingItem.hearingName = req.body.hearingName || hearingItem.hearingName;
    hearingItem.hearingDate = req.body.hearingDate || hearingItem.hearingDate;
    hearingItem.hearingNumber =
      req.body.hearingNumber || hearingItem.hearingNumber;

    const updatedHearing = await hearingItem.save();
    setSuccessMessage(res, "Hearing updated successfully.");
    res.status(200).json({ updatedHearing, message: getSuccessMessage(res) });
  } catch (err) {
    setErrorMessage(res, err.message);
    res.status(400).json({ message: getErrorMessage(res) });
  }
});

exports.deleteAllHearings = asyncHandler(async (req, res, next) => {
  try {
    await Hearing.deleteMany();
    setSuccessMessage(res, "All hearings deleted successfully.");
    res.status(200).json({ message: getSuccessMessage(res) });
  } catch (err) {
    setErrorMessage(res, err.message);
    res.status(500).json({ message: getErrorMessage(res) });
  }
});

exports.deleteHearingById = asyncHandler(async (req, res, next) => {
  try {
    const hearingItem = await Hearing.findById(req.params.id);
    if (!hearingItem) {
      setErrorMessage(res, "Hearing not found.");
      return res.status(404).json({ message: getErrorMessage(res) });
    }

    await hearingItem.deleteOne();
    setSuccessMessage(res, "Hearing deleted successfully.");
    res.status(200).json({ message: getSuccessMessage(res) });
  } catch (err) {
    setErrorMessage(res, err.message);
    res.status(500).json({ message: getErrorMessage(res) });
  }
});
