const express = require("express");
const {
chatControl,
} = require("../controllers/chatController");

const router = express.Router();

// registration for Farmer
router.route("/chat").post(chatControl); 

module.exports = router;