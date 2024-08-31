const Startup = require("../models/startupModel"); // object of farmer collection
const catchAsyncErrors = require("../middleware/catchAsyncErrors"); // by default error catcher
const bcrypt=require("bcryptjs");


exports.createStartUp = catchAsyncErrors( async (req, res) => {
  const info= req.body;
  
  try {
 
    // Create new user instance with hashed password
    const NewstartUp = new Startup(info);

    // Save the user to the database
    await NewstartUp.save();

    res.status(201).json(NewstartUp);
  } catch (error) {
    console.error('Error:', error);
    res.status(400).json({ error: error.message });
  }
});