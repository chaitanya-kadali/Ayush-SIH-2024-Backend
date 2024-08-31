const express = require("express");

const {
createFarmer,
} = require("../controllers/farmerController");

const router = express.Router();

// registration for Farmer
router.route("/farmer-reg").post(createFarmer); 