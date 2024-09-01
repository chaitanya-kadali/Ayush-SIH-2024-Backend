const Startup = require("../models/startupModel"); // object of farmer collection
const catchAsyncErrors = require("../middleware/catchAsyncErrors"); // by default error catcher
const bcrypt=require("bcryptjs");


exports.createStartUp = catchAsyncErrors( async (req, res) => {
  const {Email_ID,password,companyName,address ,city,pinCode,
    state,district,PANno,GSTno,websiteAddress,certificateNo,dateOfIssue,IssuuingAuthority,IE_code}=req.body;
  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    // Create new user instance with hashed password
    const NewstartUp = new Startup({Email_ID,password:hashedPassword,companyName,address ,city,pinCode,
      state,district,PANno,GSTno,websiteAddress,certificateNo,dateOfIssue,IssuuingAuthority,IE_code});

    // Save the user to the database
    await NewstartUp.save();

    res.status(201).json(NewstartUp);
  } catch (error) {
    console.error('Error:', error);
    res.status(400).json({ error: error.message });
  }
});

//login for Startup


  exports.StartupLogin =catchAsyncErrors(async (req,res)=>{
    const { Email_ID, password } = req.body;
    try {
    // Check if user exists in the database
    const StartupDetails = await Startup.findOne({ Email_ID });

    if (!StartupDetails) {
    // User not found, send error response
  
    return res.status(404).json({ success: false, error: 'Invalid Email_ID or password.' });
  
    }
    // Compare passwords
    const passwordMatch = await bcrypt.compare(password, StartupDetails.password);
    if (!passwordMatch) {
    // Passwords don't match, send error response
    return res.status(403).json({ success: false, error: 'Invalid Email_ID or password.' });
    }
    res.json({ success: true, message: 'Login successful', StartupDetails: StartupDetails });
    } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
     }
  });