const express = require("express");
const asyncMiddleware = require('../middleware/catchAsyncErrors');
const {
createDoctor,
} = require("../controllers/doctorController");

const router = express.Router();

// registration for Doctor
router.route("/doctor-reg").post(asyncMiddleware(createDoctor)); 

module.exports = router;