const bcrypt=require("bcryptjs");  //object for passowrd hashing
const Farmer = require("../models/farmerModel");   // object of farmer collection
const Startup = require("../models/startupModel"); // object of startup collection
const Cropname=require("../models/typesOfCrops");  //types of crops collection
const catchAsyncErrors = require("../middleware/catchAsyncErrors"); // by default error catcher
const authenticateJWT=require("../middleware/authMiddleware");  //validate the Token after login
const {Farmerschema}=require("../middleware/schemaValidator");
require('dotenv').config();

const jwt = require('jsonwebtoken');  //object to Generate JWT token


// Registration for Farmer
  exports.createFarmer = catchAsyncErrors( async (req, res) => {
  const { name, phone_number, password, district, state, crop_name, language } = req.body;
  
  PHno_Validation=await Farmer.findOne({phone_number});
    
    if(PHno_Validation){
      return res.status(404).json({success :false,error:"phone number already exists"});
    }

  // Validate the request body using Joi
    const { error } = Farmerschema.validate({ name, phone_number, password, district, state, crop_name, language });

    if (error) {
      // If validation fails, return the error message
      return res.status(400).json({ success: false, error: error.details[0].message });
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
    const newFarmer = new Farmer({
      name,
      phone_number,
      password: hashedPassword,
      district,
      state,
      crop_name,
      language,
      role:"Farmer",
      date:date.now()
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
  const token = jwt.sign(
    { id: FarmerDetails._id, phone_number: FarmerDetails.phone_number },  // Payload data
    process.env.JWT_SECRET,  // Secret key
    { expiresIn: '1h' }  // Token expiry time (1 hour)
  );

  res.status(201).json({ success: true, message: 'Login successful', token: token,FarmerDetails: FarmerDetails });
  } catch (error) {
  console.error('Error during login:', error);
  res.status(500).json({ success: false, error: 'Internal server error' });
   }
});

// Dashboard for Farmer
exports.FarmerDashboard = catchAsyncErrors(async (req, res) => {
  // Authenticate user before proceeding
  authenticateJWT(req, res, async () => {
    const { phone_number } = req.body;

    try {
      // Find the farmer by email ID
      const farmer = await Farmer.findOne({ phone_number });

      if (!farmer) {
        // If no farmer is found with the provided Email_ID, send error response
        return res.status(404).json({ success: false, error: 'Farmer not found.' });
      }

      // Now use the farmer's district to find the available startups
      const StartupsAvai = await Startup.find({ district: farmer.district });

      if (StartupsAvai.length === 0) {
        // No startups found, send error response
        return res.status(404).json({ StartupRetrievalsuccess: false, error: 'No Startups Available in the farmer\'s district.' });
      }

      // Send success response with startup details
      res.status(200).json({ success: true, StartupRetrievalsuccess: true, Tokensuccess: true, message: 'Startup Details for farmer', StartupsAvai });
    } catch (error) {
      console.error('Error during fetching startups:', error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  });
});



