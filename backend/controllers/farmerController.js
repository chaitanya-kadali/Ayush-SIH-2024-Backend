const Farmer = require("../models/farmerModel");   // object of farmer collection
const Startup = require("../models/startupModel"); // object of startup collection
const Cropname=require("../models/typesOfCrops");  //types of crops collection
const catchAsyncErrors = require("../middleware/catchAsyncErrors"); // by default error catcher
const bcrypt=require("bcryptjs");
const Joi = require('joi');


// Define the Joi schema for validation
const schema = Joi.object({
  name: Joi.string().min(3).required(),
  phone_number: Joi.string().length(10).pattern(/^[0-9]+$/).required(),
  password: Joi.string().min(8).pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
  district: Joi.string().required(),
  state: Joi.string().required(),
  crop_name: Joi.string().required(),
  language: Joi.string().optional()
});

// Registration for Farmer
app.post("/farmer-reg",async (req, res) => {
  const { name, phone_number, password, district, state, crop_name, language } = req.body;

  // Validate the request body using Joi
  const { error } = schema.validate({ name, phone_number, password, district, state, crop_name, language });

  if (error) {
    // If validation fails, return the error message
    return res.status(400).json({ success: false, error: "password must contain only letters and numbers" });
  }

  try {
    // Check if crop_name exists, and if not, create a new one
    const verify = await Cropname.findOne({ crop_name });
    if (!verify) {
      const newCropname = new Cropname({ crop_name });
      await newCropname.save();
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create newFarmer instance with hashed password
    const newFarmer = new farmer({
      name,
      phone_number,
      password: hashedPassword,
      district,
      state,
      crop_name,
      language
    });

    // Save the newFarmer to the database
    await newFarmer.save();

    // Respond with success and newFarmer data
    res.status(201).json({ data: newFarmer, success: true });
  } catch (error) {
    console.error('Error:', error);
    res.status(400).json({ success: false, error: error.message });
  }
});


//Login for Farmer
exports.FarmerLogin =catchAsyncErrors(async (req,res)=>{
  const { phone_number, password } = req.body;
  try {
  // Check if user exists in the database
  const FarmerDetails = await Farmer.findOne({ phone_number });

  if (!FarmerDetails) {
  // User not found, send error response

  return res.status(404).json({ success: false, error: 'Invalid phone_number or password.' });

  }
  // Compare passwords
  const passwordMatch = await bcrypt.compare(password, FarmerDetails.password);
  if (!passwordMatch) {
  // Passwords don't match, send error response
  return res.status(403).json({ success: false, error: 'Invalid phone_number or password.' });
  }
  res.status(201).json({ success: true, message: 'Login successful', FarmerDetails: FarmerDetails });
  } catch (error) {
  console.error('Error during login:', error);
  res.status(500).json({ success: false, error: 'Internal server error' });
   }
});

  //Dashboard for Farmer
  exports.FarmerDashboard =catchAsyncErrors(async (req,res)=>{
    const { District} = req.body;
    try {
    // Check if user exists in the database
    const StartupsAvai = await Startup.find({District});
  
    if (!StartupsAvai) {
    // User not found, send error response
    return res.status(404).json({ success: false, error: 'No Startups Available.' });
    }
  
    res.status(201).json({ success: true, message: 'Startup Details for farmer', StartupsAvai: StartupsAvai });
    } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
     }
  });

