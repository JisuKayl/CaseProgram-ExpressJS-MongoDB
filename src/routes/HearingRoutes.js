const express = require("express");
const router = express.Router();
const authenticate = require("../middlewares/authenticate");
const HearingController = require("../controllers/HearingController");

// Get All Hearings
router.get("/", authenticate, HearingController.getAllHearings);

// Get Hearing by ID
router.get("/:id", authenticate, HearingController.getHearingById);

// Create a Hearing
router.post("/", authenticate, HearingController.createHearing);

// Update Hearing by ID
router.put("/:id/", authenticate, HearingController.updateHearingById);

// Delete All Hearings
router.delete("/", authenticate, HearingController.deleteAllHearings);

// Delete Hearing by ID
router.delete("/:id", authenticate, HearingController.deleteHearingByID);

module.exports = router;
