const express = require("express");
const asyncMiddleware = require('../middleware/catchAsyncErrors');
const {
isAssigned,
isNotAssigned,
isNotifyEligible
} = require("../controllers/statusController");

const router = express.Router();

// --/isDrugInspectorAssigned-false
router.route("/isDrugInspectorAssigned-false").get(asyncMiddleware(isNotAssigned)); 

// --/isDrugInspectorAssigned-true
router.route("/isDrugInspectorAssigned-true").get(asyncMiddleware(isAssigned)); 

// --/is Eligible to click on Notify Button
router.route("/is-notify-eligible").post(asyncMiddleware(isNotifyEligible)); 


module.exports = router;