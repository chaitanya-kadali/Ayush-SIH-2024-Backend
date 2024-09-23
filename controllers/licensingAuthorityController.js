const bcrypt = require("bcryptjs");  //object for password hashing
const Licensingauthority = require("../models/licensingAuthorityModel");// object of drugInspector collection
const Startup=require("../models/startupModel");  //object of Startup collection
const LA_Notification=require("../models/LA_Notification");  //object of DI_Notification collection
const catchAsyncErrors = require("../middleware/catchAsyncErrors"); // by default error catcher
const authenticateJWT=require("../middleware/authMiddleware");  //validate the Token after login
const {LicensingAuthorityschema}=require("../middleware/schemaValidator"); 
const { GridFSBucket } = require('mongodb');
const mongoose = require('mongoose');
require('dotenv').config();
const axios = require("axios")

const multer = require("multer");//object for pdf uploading

const jwt = require('jsonwebtoken');  //object to Generate JWT token

// Multer setup
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Registration for LiscensingAuthority
exports.createLicensingAuthority = catchAsyncErrors(async (req, res) => {

  try {

    // Extract form data
    const { name, Email_ID, password, mobile_no, designation, Qualification, OrderReferenceNo, OrderDate, State, district } = req.body;

    // Check for existing Email and Phone Number
    const Email_Validation = await Licensingauthority.findOne({ Email_ID });
    const PHno_Validation = await Licensingauthority.findOne({ mobile_no });

    if (Email_Validation) {
      return res.status(401).json({ success: false, message: "Email already exists" });
    }

    if (PHno_Validation) {
      return res.status(402).json({ success: false, message: "Phone number already exists" });
    }
console.log("40");
    // Validate the request body using Joi (assuming this part is working, uncomment if necessary)
    // const { error } = LicensingAuthorityschema.validate({ name, Email_ID, password, mobile_no, designation, Qualification, OrderReferenceNo, OrderDate, State, district });
console.log("43");

    

    // Hash the password for security
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

      const newLicensingAuthority = new Licensingauthority({
        name,
        Email_ID,
        password: hashedPassword,
        mobile_no,
        designation,
        Qualification,
        OrderReferenceNo,
        OrderDate,
        State,
        district,
        Notification:[],
        role: "Licensing Authority",
        date: Date.now()
      });

      // Save the new Licensing Authority to the database
      console.log(newLicensingAuthority);
      await newLicensingAuthority.save();
      res.status(201).json({ data: newLicensingAuthority, success: true, message: "Successfully signed up!" });

  } catch (error) {
    // Catch any errors that occur during the operation
    console.error('Error creating Licensing Authority:', error);
    res.status(500).json({ success: false, message: 'Error at backend', error: error.message });
  }
});




exports.LicensingAuthorityLogin = catchAsyncErrors(async (req, res) => {
  const { Email_ID, password } = req.body;
  
  try {
    // Check if LicensingAuthorityDetails exists in the database
    const LicensingAuthorityDetails = await Licensingauthority.findOne({ Email_ID:Email_ID });

    if (!LicensingAuthorityDetails) {
      // LicensingAuthorityDetails not found, send error response
      return res.status(404).json({ success: false, error: 'Invalid Email_ID or password.' });
    }

    // Compare passwords
    const passwordMatch = await bcrypt.compare(password, LicensingAuthorityDetails.password);
    if (!passwordMatch) {
      // Passwords don't match, send error response
      return res.status(403).json({ success: false, error: 'Invalid Email_ID or password.' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: LicensingAuthorityDetails._id, Email_ID: LicensingAuthorityDetails.Email_ID },  // Payload data
      process.env.JWT_SECRET,  // Secret key
      { expiresIn: '1h' }  // Token expiry time (1 hour)
    );

    // Send success response with token and details
    res.status(200).json({ 
      success: true, 
      message: 'Login successful', 
      token: token, 
      LicensingAuthorityDetails: LicensingAuthorityDetails 
    });

  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});


    //Dashboard for LiscensingAuthority
    exports.LicensingAuthorityDashboard =catchAsyncErrors(async (req,res)=>{
      authenticateJWT(req,res,async()=>{
        const { Email_ID } = req.body;
      try {
      // Check if StartupsAvailable exists in the database
      const licensingAuthority = await Licensingauthority.findOne({Email_ID});
      
      if(!licensingAuthority){
        return res.status(404).json({success:false,error:"liscensing Authority not found"});
      }

      const StartupsAvai=await Startup.find({district:licensingAuthority.district});

      if (StartupsAvai===0) {
      // StartupsAvailable not found, send error response
    
      return res.status(404).json({ StartupRetrievalsuccess: false, error: 'No Startups Available in that district.' });
      
      }
      res.status(200).json({ success: true, Tokensuccess:true , StartupRetrievalsuccess:true,message: 'Startup Details for licensingAuthority', StartupsAvai: StartupsAvai });
      } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ success: false, error: 'Internal server error' });
       }
      })
    });

    //uploading notification from StartUp into Database
    // LA Notification Post
exports.LANotificationpost = catchAsyncErrors(async (req, res) => {
  const { Startup_Email, NotificationMsgData } = req.body;
  try {
    // Find the startup by Startup_Email to get the district
    const startup = await Startup.findOne({ Email_ID: Startup_Email });
    if (!startup) {
      return res.status(404).json({ success: false, error: 'Startup not found' });
    }
    // Get the district from the startup
    const { district } = startup;
    // Find thel iscensing Authority by matching the district
    const licensingAuthority = await Licensingauthority.findOne();
    if (!licensingAuthority) {
      return res.status(404).json({ success: false, error: 'liscensing Authority not found ' });
    }

    const email = licensingAuthority.Email_ID;

    console.log("LA email",email);
    const message = NotificationMsgData;
    const response =await axios.post("http://localhost:5002/api/send-email",{ email, message });
    if(!response.data.success){
      console.log("eror : email is not sent");
    }
  

    // Create a new LA notification
    const newLANotification = new LA_Notification({
      LA_Email: licensingAuthority.Email_ID,  // Email of the liscensingAuthority
      Startup_Email: Startup_Email,   // Email of the Startup
      Startup_Company: startup.companyName, // Startup Company Name
      notification: NotificationMsgData,  // Notification message data
      date: new Date()  // Date of notification
    });

    // Save the new notification to the database
    await newLANotification.save();

    // Return success response
    return res.status(201).json({ success: true, message: 'Notification posted successfully', data: newLANotification });

  } catch (error) {
    console.error('Error during notification post:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});


// Function to return startups for a given liscensing Authority
exports.LANotificationSendingStartups = catchAsyncErrors(async (req, res) => {
  const { Email_ID } = req.body; // Extract liscensing Authority email from the request body
  
  try {
    // Find all notifications where the LA_Email matches the provided email
    const notifications = await LA_Notification.find({ Email_ID });

    if (!notifications || notifications.length === 0) {
      return res.status(404).json({ success: false, message: 'No startups found for the given liscensingAuthority email.' });
    }

    // Extract Startup Emails and Company names into a list
    const startupDetails = notifications.map(notification => ({
      Startup_Email: notification.Startup_Email,
      Startup_Company: notification.Startup_Company
    }));

    // Return the list of startup details
    res.status(200).json({
      success: true,
      message: 'List of startups associated with the LiscensingAuthorityDetails',
      data: startupDetails
    });

  } catch (error) {
    console.error('Error fetching startups:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});


// Function to get the notification based on LA_Email and Startup_Email
exports.LA_NotificationGet = catchAsyncErrors(async (req, res) => {
  const { Startup_Email } = req.body;

  try {
    // Find the notification based on LA_Email and Startup_Email
    const notification = await LA_Notification.find();

    if (!notification) {
      return res.status(201).json({ success: true,message: 'Notification found successfully',NotificationData: []});
    }

    // Return the NotificationMsgData (notification) and the date
    res.status(200).json({
      success: true,
      message: 'Notification found successfully',
      NotificationData: notification,  // The notification message
      date: notification.date  // The date when the notification was created
    });

  } catch (error) {
    console.error('Error fetching notification:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});


