const mongoose = require('mongoose');

const peerForumSchema = new mongoose.Schema({
  Question: {
    type: String,
    required: true,
  },
  answer: {
    type: [String],  // Ensure that this is an array of strings
    default: [],
  },
});

const Peerforum = mongoose.model('Peerforum', peerForumSchema);

module.exports = Peerforum;  // Ensure you are exporting the model correctly
