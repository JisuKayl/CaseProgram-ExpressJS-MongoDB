const Case = require("../models/CaseModel");
const asyncHandler = require("express-async-handler");
const {
  setSuccessMessage,
  setErrorMessage,
  getSuccessMessage,
  getErrorMessage,
} = require("../utils/resLocalsUtil");
const userFullName = require("../utils/UserFullNameUtil");

exports.getAllCases = asyncHandler(async (req, res, next) => {
  try {
    const cases = await Case.find()
      .populate("hearings")
      .populate({
        path: "clientName",
        select: {
          _id: 0,
          fullname: userFullName(),
        },
      });
    setSuccessMessage(res, "Fetched all cases successfully.");
    res.status(200).json({ cases, message: getSuccessMessage(res) });
  } catch (err) {
    setErrorMessage(res, err.message);
    res.status(500).json({ message: getErrorMessage(res) });
  }
});

exports.getCaseById = asyncHandler(async (req, res, next) => {
  try {
    const caseItem = await Case.findById(req.params.id)
      .populate("hearings")
      .populate({
        path: "clientName",
        select: {
          _id: 0,
          fullname: userFullName(),
        },
      });
    if (!caseItem) {
      setErrorMessage(res, "Case not found.");
      return res.status(404).json({ message: getErrorMessage(res) });
    }
    setSuccessMessage(res, "Case retrieved successfully.");
    res.status(200).json({ caseItem, message: getSuccessMessage(res) });
  } catch (err) {
    setErrorMessage(res, err.message);
    res.status(500).json({ message: getErrorMessage(res) });
  }
});

exports.createCase = asyncHandler(async (req, res, next) => {
  const caseItem = new Case({
    fileNumber: req.body.fileNumber,
    caseTitle: req.body.caseTitle,
    caseNumber: req.body.caseNumber,
    caseStatus: req.body.caseStatus,
    kindOfCase: req.body.kindOfCase,
    courtCase: req.body.courtCase,
    engagedDate: req.body.engagedDate,
    location: req.body.location,
    clientName: req.body.clientName,
    hearings: req.body.hearings,
  });

  try {
    const newCase = await caseItem.save();
    setSuccessMessage(res, "Case created successfully.");
    res.status(201).json({ newCase, message: getSuccessMessage(res) });
  } catch (err) {
    setErrorMessage(res, "Failed to create case.");
    res.status(400).json({ message: getErrorMessage(res) });
  }
});

exports.updateCaseById = asyncHandler(async (req, res, next) => {
  try {
    const caseItem = await Case.findById(req.params.id);
    if (!caseItem) {
      setErrorMessage(res, "Case not found.");
      return res.status(404).json({ message: getErrorMessage(res) });
    }

    // Update fields
    caseItem.fileNumber = req.body.fileNumber || caseItem.fileNumber;
    caseItem.caseTitle = req.body.caseTitle || caseItem.caseTitle;
    caseItem.caseNumber = req.body.caseNumber || caseItem.caseNumber;
    caseItem.caseStatus = req.body.caseStatus || caseItem.caseStatus;
    caseItem.kindOfCase = req.body.kindOfCase || caseItem.kindOfCase;
    caseItem.courtCase = req.body.courtCase || caseItem.courtCase;
    caseItem.engagedDate = req.body.engagedDate || caseItem.engagedDate;
    caseItem.location = req.body.location || caseItem.location;
    caseItem.clientName = req.body.clientName || caseItem.clientName;

    const updatedCase = await caseItem.save();
    setSuccessMessage(res, "Case updated successfully.");
    res.status(200).json({ updatedCase, message: getSuccessMessage(res) });
  } catch (err) {
    setErrorMessage(res, err.message);
    res.status(400).json({ message: getErrorMessage(res) });
  }
});

exports.deleteAllCases = asyncHandler(async (req, res, next) => {
  try {
    await Case.deleteMany();
    setSuccessMessage(res, "All cases deleted successfully.");
    res.status(200).json({ message: getSuccessMessage(res) });
  } catch (err) {
    setErrorMessage(res, err.message);
    res.status(500).json({ message: getErrorMessage(res) });
  }
});

exports.deleteCaseById = asyncHandler(async (req, res, next) => {
  try {
    const caseItem = await Case.findById(req.params.id);
    if (!caseItem) {
      setErrorMessage(res, "Case not found.");
      return res.status(404).json({ message: getErrorMessage(res) });
    }

    await caseItem.deleteOne();
    setSuccessMessage(res, "Case deleted successfully.");
    res.status(200).json({ message: getSuccessMessage(res) });
  } catch (err) {
    setErrorMessage(res, err.message);
    res.status(500).json({ message: getErrorMessage(res) });
  }
});
