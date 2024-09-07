const Farmer = require("../models/farmerModel");   // object of farmer collection
const Startup = require("../models/startupModel"); // object of startup collection
const Cropname=require("../models/typesOfCrops");  //types of crops collection
const catchAsyncErrors = require("../middleware/catchAsyncErrors"); // by default error catcher
const bcrypt=require("bcryptjs");


//Registration for Farmer
exports.createFarmer = catchAsyncErrors( async (req, res) => {
  const {name,phone_number,password,district,state,crop_name,language}= req.body;

  try { 

  const verify = await Cropname.findOne({ crop_name });
  if(!verify){
    const newCropname= new Cropname({crop_name});
    await newCropname.save();
  }
    // Hash the password

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user instance with hashed password
    const newFarmer = new Farmer({name,phone_number,password:hashedPassword,district,state,crop_name,language});

    // Save the user to the database
    await newFarmer.save();
    res.status(201).json({data:newDoctor, success: true}); // modified to match frontend
} catch (error) {
    console.error('Error:', error);
    res.status(400).json({ error: error.message,success: false });
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
  res.json({ success: true, message: 'Login successful', FarmerDetails: FarmerDetails });
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
  
    res.json({ success: true, message: 'Startup Details for farmer', StartupsAvai: StartupsAvai });
    } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
     }
  });

