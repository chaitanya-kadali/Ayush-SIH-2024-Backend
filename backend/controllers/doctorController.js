const Doctor = require("../models/doctormodel"); // object of doctor collection
const catchAsyncErrors = require("../middleware/catchAsyncErrors"); // by default error catcher
const bcrypt=require("bcryptjs");


exports.createDoctor = catchAsyncErrors( async (req, res) => {
    const {name,Email_ID,password,district,state,phone_number,language}= req.body;
    
    try {
      // Hash the password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
  
      // Create new user instance with hashed password
      const newDoctor = new Doctor({name,Email_ID,password:hashedPassword,district,state,phone_number,language});
  
      // Save the user to the database
      await newDoctor.save();
  
      res.status(201).json(newDoctor);
    } catch (error) {
      console.error('Error:', error);
      res.status(400).json({ error: error.message });
    }
  });