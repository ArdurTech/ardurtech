const express = require("express");
const router = express.Router();
const { TimesheetController } = require("../controllers/TimesheetController");

router.post("/timesheet", TimesheetController);

module.exports = router;