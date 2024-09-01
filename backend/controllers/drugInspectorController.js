const Druginspector = require("../models/drugInspectorModel");// object of drugInspector collection
const catchAsyncErrors = require("../middleware/catchAsyncErrors"); // by default error catcher
const bcrypt=require("bcryptjs");



//registration for Doctor
exports.createDrugInspector = catchAsyncErrors( async (req, res) => {
    const {Email_ID,password}= req.body;
    
    try {
      // Hash the password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
  
      // Create new user instance with hashed password
      const newDrugInspector = new Druginspector({Email_ID,password:hashedPassword});
  
      // Save the user to the database
      await newDrugInspector.save();
  
      res.status(201).json(newDrugInspector);
    } catch (error) {
      console.error('Error:', error);
      res.status(400).json({ error: error.message });
    }
  });


  //login for DrugInspector

  exports.drugInspectorLogin =catchAsyncErrors(async (req,res)=>{
    const { Email_ID, password } = req.body;
    try {
    // Check if user exists in the database
    const DruginspectorDetails = await Druginspector.findOne({ Email_ID });

    if (!DruginspectorDetails) {
    // User not found, send error response
  
    return res.status(404).json({ success: false, error: 'Invalid Email_ID or password.' });
  
    }
    // Compare passwords
    const passwordMatch = await bcrypt.compare(password, DruginspectorDetails.password);
    if (!passwordMatch) {
    // Passwords don't match, send error response
    return res.status(403).json({ success: false, error: 'Invalid Email_ID or password.' });
    }
    res.json({ success: true, message: 'Login successful', DruginspectorDetails: DruginspectorDetails });
    } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
     }
  });