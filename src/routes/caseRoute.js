const express = require("express");
const router = express.Router();
const authenticate = require("../middlewares/authenticate");
const caseController = require("../controllers/caseController");

// Get All Cases
router.get("/", authenticate, caseController.getAllCases);

// Get Case by ID
router.get("/:id", authenticate, caseController.getCasebyId);

// Create a Case
router.post("/", authenticate, caseController.createCase);

// Update Case by ID
router.put("/:id", authenticate, caseController.updateCaseById);

// Delete All Cases
router.delete("/", authenticate, caseController.deleteAllCases);

// Delete Case by ID
router.delete("/:id", authenticate, caseController.deleteCaseById);

module.exports = router;
