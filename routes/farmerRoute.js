const express = require("express");
const asyncMiddleware = require('../middleware/catchAsyncErrors');
const {
createFarmer,
FarmerLogin,
FarmerDashboard
} = require("../controllers/farmerController");

const router = express.Router();

// Registration for Farmer
router.route("/farmer-reg").post(asyncMiddleware(createFarmer)); 

//Login for Farmer
router.route("/farmer-login").post(asyncMiddleware(FarmerLogin)); 

//Dashboard for Farmer
router.route("/farmer-dashboard").post(asyncMiddleware(FarmerDashboard));

module.exports = router;