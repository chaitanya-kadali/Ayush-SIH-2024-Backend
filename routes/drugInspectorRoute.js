const express = require("express");
const asyncMiddleware = require('../middleware/catchAsyncErrors');
const {
    createDruginspector,
    DruginspectorLogin,
    DruginspectorDashboard
} = require("../controllers/drugInspectorController");

const router = express.Router();

// registration for Doctor
router.route("/drugInspector-reg").post(asyncMiddleware(createDruginspector));

//login for doctor
router.route("/drugInspector-login").post(asyncMiddleware(DruginspectorLogin)); 

//Doctor Dashboard
router.route("/drugInspector-dashboard").post(asyncMiddleware(DruginspectorDashboard));

module.exports = router;