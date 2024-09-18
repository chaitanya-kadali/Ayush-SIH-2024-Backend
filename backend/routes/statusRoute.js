const express = require("express");
const asyncMiddleware = require('../middleware/catchAsyncErrors');
const {
isAssigned,
isNotAssigned,
isNotifyEligible,
statusTrackpad
} = require("../controllers/statusController");

const router = express.Router();

// --/isDrugInspectorAssigned-false
router.route("/isDrugInspectorAssigned-false").get(asyncMiddleware(isNotAssigned)); 

// --/isDrugInspectorAssigned-true
router.route("/isDrugInspectorAssigned-true").get(asyncMiddleware(isAssigned)); 

// --/is Eligible to click on Notify Button
router.route("/isNotifyEligible").post(asyncMiddleware(isNotifyEligible)); 

router.route("/status-trackpad").post(asyncMiddleware(statusTrackpad)); 


module.exports = router;