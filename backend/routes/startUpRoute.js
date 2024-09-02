const express = require("express");
const asyncMiddleware = require('../middleware/catchAsyncErrors');
const {
createStartUp,
StartupLogin,
StartupF_Dashboard,
StartupD_Dashboard
} = require("../controllers/startupController");

const router = express.Router();

// registration for StartUp
router.route("/startup-reg").post(asyncMiddleware(createStartUp)); 

//login for startup
router.route("/startup-login").post(asyncMiddleware(StartupLogin)); 

//dashboard for startup farmer
router.route("/startupf-dashboard").post(asyncMiddleware(StartupF_Dashboard)); 

//dashboard for startup doctor
router.route("/startupd-dashboard").post(asyncMiddleware(StartupD_Dashboard)); 
module.exports = router;