const express = require("express");
const asyncMiddleware = require('../middleware/catchAsyncErrors');
const {
isAssigned,
isNotAssigned,
isNotifyEligible,
isAccepted,
isRejected,
isLicensed,
statusTrackpad
} = require("../controllers/statusController");

const router = express.Router();

// --/isDrugInspectorAssigned-false
router.route("/isDrugInspectorAssigned-false").get(asyncMiddleware(isNotAssigned)); 

// --/isDrugInspectorAssigned-true
router.route("/isDrugInspectorAssigned-true").get(asyncMiddleware(isAssigned)); 

// -- / isDrugInspectorAccepted-true
router.route("/isDrugInspectorAccepted-true").get(asyncMiddleware(isAccepted)); 

// -- / isDrugInspectorRejected-true
router.route("/isDrugInspectorRejected-true").get(asyncMiddleware(isRejected)); 

// -- /isLicensed-true
router.route("/isLicensed-true").get(asyncMiddleware(isLicensed)); 

// --/is Eligible to click on Notify Button
router.route("/is-notify-eligible").post(asyncMiddleware(isNotifyEligible)); 

router.route("/status-trackpad").post(asyncMiddleware(statusTrackpad)); 


module.exports = router;