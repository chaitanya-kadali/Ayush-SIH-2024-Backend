const Peerforum = require("../models/peerForumModel");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");

exports.CreateQuestion = catchAsyncErrors(async (req, res) => {
  const { Question,answer } = req.body; // Receiving both question and answer from request body

  try {
    // Check if the question already exists in the database
    const VerifyQuestion = await Peerforum.findOne({ Question });

    if (!VerifyQuestion) {
      // If the question does not exist, create a new document with an empty answer array
      const newPeerForum = new Peerforum({
        Question: Question,
        answer: []  // Initialize with an empty array
      });
      await newPeerForum.save();
      return res.status(201).json({ success: true, message: "New Question Successfully Inserted" });
    } else {
      // If the question exists, push the new answer into the answer array
      VerifyQuestion.answer.push(answer);
      await VerifyQuestion.save();
      return res.status(200).json({ success: true, message: "Answer added to existing question" });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
});

exports.AnswerToQuestion = catchAsyncErrors(async (req, res) => {
    const { Question } = req.body;
  
    try {
      // Find the question in the database
      const VerifyQuestion = await Peerforum.findOne({ Question });
  
      // If the question does not exist, return a 404 error
      if (!VerifyQuestion) {
        return res.status(404).json({ success: false, message: "Question not found in Database" });
      }
  
      // If the question exists, return the answer array
      return res.status(200).json({ success: true, message: "Answers returned", data: VerifyQuestion.answer });
    } catch (error) {
      // Return an internal server error in case of failure
      return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
  });
