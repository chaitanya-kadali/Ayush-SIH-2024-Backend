const express = require("express");
const asyncMiddleware = require('../middleware/catchAsyncErrors');
const {
isAssigned
} = require("../controllers/statusController");

const router = express.Router();

// --/isDrugInspectorAssigned-false
router.route("/isDrugInspectorAssigned-false").get(asyncMiddleware(isAssigned)); 


module.exports = router;