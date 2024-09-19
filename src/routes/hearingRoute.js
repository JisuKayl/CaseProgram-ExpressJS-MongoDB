const express = require("express");
const router = express.Router();
const Hearing = require("../models/hearingData");
const authenticate = require("../middlewares/authenticate");

// Get All Hearings
router.get("/", authenticate, async (req, res) => {
  try {
    const hearings = await Hearing.find().populate("caseId");
    res.status(200).json(hearings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get Hearing by ID
router.get("/:id", authenticate, async (req, res) => {
  try {
    const hearingItem = await Hearing.findById(req.params.id);
    if (!hearingItem)
      return res.status(404).json({ message: "Hearing not found" });
    res.status(200).json(hearingItem);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a Hearing
router.post("/", authenticate, async (req, res) => {
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

// Update Hearing by ID
router.put("/:id/", authenticate, async (req, res) => {
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

// Delete Hearing by ID
router.delete("/:id", authenticate, async (req, res) => {
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

// Delete All Hearings
router.delete("/", authenticate, async (req, res) => {
  try {
    await Hearing.deleteMany();
    res.status(200).json({ message: "All hearings deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
