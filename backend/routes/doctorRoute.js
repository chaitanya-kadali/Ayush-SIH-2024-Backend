const express = require("express");
const asyncMiddleware = require('../middleware/catchAsyncErrors');
const {
createDoctor,DoctorLogin
} = require("../controllers/doctorController");

const router = express.Router();

// registration for Doctor
router.route("/doctor-reg").post(asyncMiddleware(createDoctor)); 
//login for doctor
router.route("/doctor-login").post(asyncMiddleware(DoctorLogin)); 

module.exports = router;