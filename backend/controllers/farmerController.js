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

    // Save the user to the database
    await newFarmer.save();

    res.status(201).json(newFarmer);
  } catch (error) {
    console.error('Error:', error);
    res.status(400).json({ error: error.message });
  }
});

exports.FarmerLogin =catchAsyncErrors(async (req,res)=>{
  const { phone_number, password } = req.body;
  try {
  // Check if user exists in the database
  const LoginDetails = await Farmer.findOne({ phone_number });
  // console.log(user);
  // res.json(user);
  // ok
  if (!LoginDetails) {
  // User not found, send error response

  return res.status(404).json({ success: false, error: 'Invalid phone_number or password.' });

  }
  // Compare passwords
  const passwordMatch = await bcrypt.compare(password, LoginDetails.password);
  if (!passwordMatch) {
  // Passwords don't match, send error response
  return res.status(403).json({ success: false, error: 'Invalid phone_number or password.' });
  }
  res.json({ success: true, message: 'Login successful', LoginDetails: LoginDetails });
  } catch (error) {
  console.error('Error during login:', error);
  res.status(500).json({ success: false, error: 'Internal server error' });
   }
})