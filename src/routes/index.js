const express = require("express");
const router = express.Router();

const UserRoutes = require("./UserRoutes.js");
const CaseRoutes = require("./CaseRoutes.js");
const HearingRoutes = require("./HearingRoutes.js");

router.use("/", UserRoutes);
router.use("/cases", CaseRoutes);
router.use("/hearings", HearingRoutes);

module.exports = router;
