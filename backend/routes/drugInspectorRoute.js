const express = require("express");

const asyncMiddleware = require('../middleware/catchAsyncErrors');
const {
    drugInspectorLogin,
    DrugInspectorDashboard
} = require("../controllers/drugInspectorController");

const router = express.Router();

//Login for drugInspector
router.route("/drugInspector-login").post(asyncMiddleware(drugInspectorLogin));

//Dashboard for drugInspector
router.route("/drugInspector-dashboard").post(asyncMiddleware(DrugInspectorDashboard));

module.exports = router;