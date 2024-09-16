const express = require("express");
const router = express.Router();

const userRoutes = require("./routing/UserRoutes.js");
const caseRoutes = require("./routing/CaseRoutes.js");
const hearingRoutes = require("./routing/hearingRoutes.js");

router.use("/case", caseRoutes);
router.use("/hearing", hearingRoutes);
router.use("/user", userRoutes);

module.exports = router;
