const express = require("express");

const asyncMiddleware = require('../middleware/catchAsyncErrors');
const {
    createDrugInspector,
    drugInspectorLogin
} = require("../controllers/drugInspectorController");

const router = express.Router();

//Login for drugInspector
router.route("/drugInspector-login").post(asyncMiddleware(drugInspectorLogin));

module.exports = router;