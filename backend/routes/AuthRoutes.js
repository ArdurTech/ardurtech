// AuthRoutes.js
const express = require("express");
const router = express.Router();

const { SignUpController, LoginController, EmployeeDetailsController } = require("../controllers/AuthControllers");
const { TimesheetController } = require("../controllers/TimesheetController"); // Import TimesheetController correctly

router.post("/signup", SignUpController);

router.post("/login", LoginController);

router.post("/employee-details", EmployeeDetailsController);

router.post("/api/timesheet", TimesheetController);

module.exports = router;
