const express = require("express");
const asyncMiddleware = require('../middleware/catchAsyncErrors');
const {
createDoctor,
DoctorLogin,
DoctorDashboard,
googleAuth,
oauth2callback
} = require("../controllers/doctorController");

const router = express.Router();

// registration for Doctor
router.route("/doctor-reg").post(asyncMiddleware(createDoctor));

//login for doctor
router.route("/doctor-login").post(asyncMiddleware(DoctorLogin)); 

//Doctor Dashboard
router.route("/doctor-dashboard").post(asyncMiddleware(DoctorDashboard));

router.get('/auth/google', googleAuth);
router.get('/oauth2callback',oauth2callback);

module.exports = router;