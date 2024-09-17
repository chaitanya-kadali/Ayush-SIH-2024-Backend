const express = require("express");
const asyncMiddleware = require('../middleware/catchAsyncErrors');
const {
    CreateQuestion,
    AnswerToQuestion
} = require("../controllers/PeerForumController");

const router = express.Router();

// Store peer forum question in database
router.route("/store-question").post(asyncMiddleware(CreateQuestion)); 

// return answer for a question
router.route("/answer-to-question").post(asyncMiddleware(AnswerToQuestion));

module.exports = router;