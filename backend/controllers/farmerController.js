const Farmer = require("../models/farmerModel"); // object of farmer collection
const catchAsyncErrors = require("../middleware/catchAsyncErrors"); // by default error catcher
const bcrypt=require("bcryptjs");


exports.createFarmer = catchAsyncErrors( async (req, res) => {
  const {name,phone_number,password,district,state,crop_name,language}= req.body;
  
  try {
    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user instance with hashed password
    const newFarmer = new Farmer({name,phone_number,password:hashedPassword,district,state,crop_name,language});

    // Save the user to the databas
    await newFarmer.save();

    res.status(201).json(newFarmer);
  } catch (error) {
    console.error('Error:', error);
    res.status(400).json({ error: error.message });
  }
});