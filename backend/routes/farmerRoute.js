const express = require("express");
const asyncMiddleware = require('../middleware/catchAsyncErrors');
const {
createFarmer,
FarmerLogin
} = require("../controllers/farmerController");

const router = express.Router();

// registration for Farmer
router.route("/farmer-reg").post(asyncMiddleware(createFarmer)); 
//login for farmer
router.route("/farmer-login").post(asyncMiddleware(FarmerLogin)); 

module.exports = router;