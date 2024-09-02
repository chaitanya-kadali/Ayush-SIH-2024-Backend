const Doctor = require("../models/doctormodel"); // object of doctor collection
const Startup = require("../models/startupModel");// object of startup collection
const catchAsyncErrors = require("../middleware/catchAsyncErrors"); // by default error catcher
const bcrypt=require("bcryptjs");

//registration for Doctor
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
  
      res.status(201).json({data:newDoctor, success: true}); // modified to match frontend
    } catch (error) {
      console.error('Error:', error);
      res.status(400).json({ error: error.message,success: false });
    }
  });


  //login for doctor

  exports.DoctorLogin =catchAsyncErrors(async (req,res)=>{
    const { Email_ID, password } = req.body;
    try {
    // Check if user exists in the database
    const DoctorDetails = await Doctor.findOne({ Email_ID });

    if (!DoctorDetails) {
    // User not found, send error response
  
    return res.status(404).json({ success: false, error: 'Invalid Email_ID or password.' });
  
    }
    // Compare passwords
    const passwordMatch = await bcrypt.compare(password, DoctorDetails.password);
    if (!passwordMatch) {
    // Passwords don't match, send error response
    return res.status(403).json({ success: false, error: 'Invalid Email_ID or password.' });
    }
    res.json({ success: true, message: 'Login successful', DoctorDetails: DoctorDetails });
    } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
     }
  });

  //Doctor Dashboard

  exports.DoctorDashboard =catchAsyncErrors(async (req,res)=>{
    const { District} = req.body;
    try {
    // Check if startups exists in the database
    const StartupsAvai = await Startup.find({District});
  
    if (!StartupsAvai) {

  
    return res.status(404).json({ success: false, error: 'No Startups Available.' });
  
    }
  
    res.json({ success: true, message: 'Startup Details for doctor', StartupsAvai: StartupsAvai});
    } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
     }
  });