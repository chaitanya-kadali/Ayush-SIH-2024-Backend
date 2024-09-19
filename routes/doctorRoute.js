const express = require("express");
const asyncMiddleware = require('../middleware/catchAsyncErrors');
const {
createDoctor,
DoctorLogin,
DoctorDashboard,
grantPermission
} = require("../controllers/doctorController");

const router = express.Router();

// registration for Doctor
router.route("/doctor-reg").post(asyncMiddleware(createDoctor));

//login for doctor
router.route("/doctor-login").post(asyncMiddleware(DoctorLogin));

//Doctor Dashboard
router.route("/doctor-dashboard").post(asyncMiddleware(DoctorDashboard));

//granting of permission
router.route("/grant-permission-to-doctor").post(asyncMiddleware(grantPermission));

module.exports = router;