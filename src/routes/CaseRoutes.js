const express = require("express");
const router = express.Router();
const authenticate = require("../middlewares/authenticate");
const CaseController = require("../controllers/CaseController");

// Get All Cases
router.get("/", authenticate, CaseController.getAllCases);

// Get Case by ID
router.get("/:id", authenticate, CaseController.getCasebyId);

// Create a Case
router.post("/", authenticate, CaseController.createCase);

// Update Case by ID
router.put("/:id", authenticate, CaseController.updateCaseById);

// Delete All Cases
router.delete("/", authenticate, CaseController.deleteAllCases);

// Delete Case by ID
router.delete("/:id", authenticate, CaseController.deleteCaseById);

module.exports = router;
