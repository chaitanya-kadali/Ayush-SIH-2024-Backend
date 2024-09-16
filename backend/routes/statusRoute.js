const express = require("express");
const asyncMiddleware = require('../middleware/catchAsyncErrors');
const {
isAssigned,
isNotifyEligible
} = require("../controllers/statusController");

const router = express.Router();

// --/isDrugInspectorAssigned-false
router.route("/isDrugInspectorAssigned-false").get(asyncMiddleware(isAssigned)); 

// --/is Eligible to click on Notify Button
router.route("/isNotifyEligible").post(asyncMiddleware(isNotifyEligible)); 


module.exports = router;