const Farmer = require("../models/farmerModel");   // object of farmer collection
const Startup = require("../models/startupModel"); // object of startup collection
const Cropname=require("../models/typesOfCrops");  //types of crops collection
const  catchAsyncErrors = require("../middleware/catchAsyncErrors"); // by default error catcher
const bcrypt=require("bcryptjs");
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const JWT_SECRET="secret_key_for_StartupPortal";

  // Middleware to verify JWT token
  const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        // Extract token from Bearer header
        const token = authHeader.split(' ')[1];

        jwt.verify(token, JWT_SECRET, (err, user) => {
            if (err) {
                return res.status(403).json({ success: false, error: 'Invalid token.' });
            }
            // Attach user information to the request
            req.user = user;
            next();
        });
    } else {
        res.status(401).json({ success: false, error: 'Authorization token missing.' });
    }
};


// Define the Joi schema for validation
const schema = Joi.object({
  name: Joi.string().min(3).required(),
  phone_number: Joi.number().integer().min(1000000000).max(9999999999).required(),
  password: Joi.string().min(8).pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
  district: Joi.string().required(),
  state: Joi.string().required(),
  crop_name: Joi.string().required(),
  language: Joi.string().optional()
});

// Registration for Farmer
  exports.createFarmer = catchAsyncErrors( async (req, res) => {
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
    const newFarmer = new Farmer({
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
  const token = jwt.sign(
    { id: FarmerDetails._id, phone_number: FarmerDetails.phone_number },  // Payload data
    JWT_SECRET,  // Secret key
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
    const { district } = req.body;

    try {
      // Check if any startups are available in the specified district
      const StartupsAvai = await Startup.find({ district });

      if (StartupsAvai.length === 0) {
        // No startups found, send error response
        return res.status(404).json({ success: false, error: 'No Startups Available.' });
      }

      // Send success response with startup details
      res.status(200).json({ success: true, message: 'Startup Details for farmer', StartupsAvai });
    } catch (error) {
      console.error('Error during fetching startups:', error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  });
});


