const express = require("express");
const router = express.Router();
const authenticate = require("../middlewares/authenticate");
const hearingController = require("../controllers/hearingController");

// Get All Hearings
router.get("/", authenticate, hearingController.getAllHearings);

// Get Hearing by ID
router.get("/:id", authenticate, hearingController.getHearingById);

// Create a Hearing
router.post("/", authenticate, hearingController.createHearing);

// Update Hearing by ID
router.put("/:id/", authenticate, hearingController.updateHearingById);

// Delete All Hearings
router.delete("/", authenticate, hearingController.deleteAllHearings);

// Delete Hearing by ID
router.delete("/:id", authenticate, hearingController.deleteHearingByID);

module.exports = router;
