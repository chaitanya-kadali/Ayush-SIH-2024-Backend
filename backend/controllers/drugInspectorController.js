const Druginspector = require("../models/drugInspectorModel");// object of drugInspector collection
const Startup=require("../models/startupModel");  //object of Startup collection
const catchAsyncErrors = require("../middleware/catchAsyncErrors"); // by default error catcher
const bcrypt=require("bcryptjs");


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

    //Dashboard for Drug Inspector
    exports.DrugInspectorDashboard =catchAsyncErrors(async (req,res)=>{
      const { District} = req.body;
      try {
      // Check if user exists in the database
      const StartupsAvai = await Startup.find({District});
    
      if (!StartupsAvai) {
      // User not found, send error response
    
      return res.status(404).json({ success: false, error: 'No Startups Available.' });
    
      }
    
      res.json({ success: true, message: 'Startup Details for DrugInspector', StartupsAvai: StartupsAvai });
      } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ success: false, error: 'Internal server error' });
       }
    });