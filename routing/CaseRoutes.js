const express = require("express");
const router = express.Router();
const Case = require("../models/casedata");
const authenticate = require("../middleware/authenticate");

// Get All Cases
router.get("/", authenticate, async (req, res) => {
  try {
    const cases = await Case.find().populate("hearings");
    res.status(200).json(cases);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get Case by ID
router.get("/:id", authenticate, async (req, res) => {
  try {
    const caseItem = await Case.findById(req.params.id);
    if (!caseItem) return res.status(404).json({ message: "Case not found" });
    res.status(200).json(caseItem);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a Case
router.post("/", authenticate, async (req, res) => {
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

    res.status(201).json(newCase);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update Case by ID
router.put("/:id/", authenticate, async (req, res) => {
  try {
    const caseItem = await Case.findById(req.params.id);
    if (!caseItem) return res.status(404).json({ message: "Case not found" });

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
    res.status(200).json(updatedCase);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete Case by ID
router.delete("/:id", authenticate, async (req, res) => {
  try {
    const caseItem = await Case.findById(req.params.id);
    if (!caseItem) return res.status(404).json({ message: "Case not found" });

    await caseItem.deleteOne();
    res.status(200).json({ message: "Case deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete All Cases
router.delete("/", authenticate, async (req, res) => {
  try {
    await Case.deleteMany();
    res.status(200).json({ message: "All cases deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
