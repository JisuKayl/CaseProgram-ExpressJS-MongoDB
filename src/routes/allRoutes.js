const express = require("express");
const router = express.Router();

const userRoutes = require("./userRoute.js");
const caseRoutes = require("./caseRoute.js");
const hearingRoutes = require("./hearingRoute.js");

router.use("/", userRoutes);
router.use("/case", caseRoutes);
router.use("/hearing", hearingRoutes);

module.exports = router;
