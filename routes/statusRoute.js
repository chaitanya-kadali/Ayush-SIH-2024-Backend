const express = require("express");
const asyncMiddleware = require('../middleware/catchAsyncErrors');
const {
isAssigned,
isNotAssigned,
isNotifyEligible,
isAccepted,
isRejected,
isLARejected,
isLicensed,
statusTrackpad,
makeItAssigned,
makeItAccepted,
makeItRejected,
makeItLicensed,
makeItLARejected
} = require("../controllers/statusController");

const router = express.Router();

// --/isDrugInspectorAssigned-false
router.route("/isfilledapplication-false").get(asyncMiddleware(isNotAssigned)); 

// --/isDrugInspectorAssigned-true
router.route("/isDrugInspectorAssigned-true").get(asyncMiddleware(isAssigned)); 

// -- / isDrugInspectorAccepted-true
router.route("/isDrugInspectorAccepted-true").get(asyncMiddleware(isAccepted)); 

// -- / isDrugInspectorRejected-true
router.route("/isDrugInspectorRejected-true").get(asyncMiddleware(isRejected)); 

router.route("/isLArejected").get(asyncMiddleware(isLARejected)); 

// -- /isLicensed-true
router.route("/isLicensed-true").get(asyncMiddleware(isLicensed)); 

// --/is Eligible to click on Notify Button
router.route("/is-notify-eligible").post(asyncMiddleware(isNotifyEligible)); 

router.route("/status-trackpad").post(asyncMiddleware(statusTrackpad)); 

router.route("/make-it-assign").post(asyncMiddleware(makeItAssigned)); 

router.route("/make-it-LArejected").post(asyncMiddleware(makeItLARejected)); 

router.route("/make-it-accepted").post(asyncMiddleware(makeItAccepted));

router.route("/make-it-rejected").post(asyncMiddleware(makeItRejected))

router.route("/make-it-licensed").post(asyncMiddleware(makeItLicensed))
module.exports = router;