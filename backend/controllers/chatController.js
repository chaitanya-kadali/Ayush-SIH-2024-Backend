require('dotenv').config(); // Load environment variables
const axios = require('axios');
const bodyParser = require('body-parser');

const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

function generateLengthyString(messages) {
  return messages.map((message, index) => {
      const tag = index % 2 === 0 ? "assistant" : "user";
      return `${tag}: ${message.content}`;
    }).join(' ');
}

const introContentPart1 =`You are now my personal AI model for aayush minstry of government of india. I will provide you with our previous conversation:  `;
const introContentPart2= ` Your task is to analyze the entire conversation and then respond to the last message as if it were your own question, 
using the context provided.`;

exports.chatControl= async (req, res )=> {
  try {
      const { messagesreq } = req.body;
      const chatSession = model.startChat({
      generationConfig,
   
      history: [
      ],
    });
    const messages=generateLengthyString(messagesreq);
    console.log(messages);
      const result = await chatSession.sendMessage(`${introContentPart1}  ${messages} ${introContentPart2}`);
      console.log("we got something like : \n\n");
      console.log(result.response.text());
      return res.status(200).json({
            success: true,
            data: result.response.text(),
          });
    }catch (error) {
        console.error('Error details:', error); // Log detailed error information
        return res.status(400).json({
              success: false,
              error: error.response
              ? error.response.data
              : "There was an issue on the server",
            });
        console.log("we got error at sending message to gemini");
        }
  }