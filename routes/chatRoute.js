const express = require("express");
const {
chatControl,
} = require("../controllers/chatController");

const router = express.Router();

// chat route
router.route("/chat").post(chatControl); 

module.exports = router;