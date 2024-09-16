const bcrypt = require("bcryptjs");  //object for password hashing
const Liscensingauthority = require("../models/liscensingAuthorityModel");// object of drugInspector collection
const Startup=require("../models/startupModel");  //object of Startup collection
const LA_Notification=require("../models/LA_Notification");  //object of DI_Notification collection
const catchAsyncErrors = require("../middleware/catchAsyncErrors"); // by default error catcher
const authenticateJWT=require("../middleware/authMiddleware");  //validate the Token after login
const {LiscensingAuthorityschema}=require("../middleware/schemaValidator"); 
require('dotenv').config();

const multer = require("multer");//object for pdf uploading

const jwt = require('jsonwebtoken');  //object to Generate JWT token



// Configure Multer with file type and size restrictions
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./files"); // Set the directory where you want to save the files
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname); // Set the file name to save
  }
});

// File validation: Limit to PDF and file size
const fileFilter = (req, file, cb) => {
  // Only accept PDF files
  const fileType = file.mimetype;
  if (fileType === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only PDF files are allowed."), false);
  }
};

// Set file size limit to 5MB
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 1024 * 1024 * 5 } // 5MB file size limit
});


// Registration for LiscensingAuthority
exports.createLiscensingAuthority = catchAsyncErrors(async (req, res) => {
  // Multer middleware for handling single file upload
  const uploadMiddleware = upload.single('OrderPdfCopy');

  // Invoke the multer middleware manually
  uploadMiddleware(req, res, async (err) => {
    if (err) {
      return res.status(500).send(err.message); // Multer-related error
    }
    if (!req.file) {
      return res.status(400).send('No file uploaded.'); // No file uploaded error
    }

    // Extract form data
    const { name, Email_ID, password, mobile_no, designation, Qualification, orderReferenceNo, OrderDate, State, district } = req.body;
    // Validate the request body using Joi
    const { error } = LiscensingAuthorityschema.validate({ name, Email_ID, password, mobile_no, designation, Qualification, orderReferenceNo, OrderDate, State, district});

    if (error) {
      // If validation fails, return the error message
      return res.status(400).json({ success: false, error: "password must contain only letters and numbers" });
    }
    try {
      // Hash the password for security
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Get the file path of the uploaded PDF
      const pdfFilePath = req.file.path;

      // Create a new Drug Inspector with the uploaded PDF's file path
      const newLiscensingAuthority = new Liscensingauthority({
        name, 
        Email_ID, 
        password: hashedPassword,
        mobile_no,
        designation,
        Qualification,
        orderReferenceNo,
        OrderDate,
        OrderPdfCopy: pdfFilePath,
        State,
        district
      });

      // Save the Drug Inspector to the database
      await newLiscensingAuthority.save();

      res.status(201).json({ data: newLiscensingAuthority, success: true });
    } catch (error) {
      console.error('Error:', error);
      res.status(400).json({ error: error.message, success: false });
    }
  });
});



  //login for LiscensingAuthority
  exports.LiscensingAuthorityLogin =catchAsyncErrors(async (req,res)=>{
    const { Email_ID, password } = req.body;
    try {
    // Check if LiscensingAuthorityDetails exists in the database
    const LiscensingAuthorityDetails = await Liscensingauthority.findOne({ Email_ID });
    
    if (!LiscensingAuthorityDetails) {
    // LiscensingAuthorityDetails not found, send error response
    
    return res.status(404).json({ success: false, error: 'Invalid Email_ID or password.' });
    
    }
    // Compare passwords
    const passwordMatch = await bcrypt.compare(password, LiscensingAuthorityDetails.password);
    if (!passwordMatch) {
    // Passwords don't match, send error response
    return res.status(403).json({ success: false, error: 'Invalid Email_ID or password.' });
    }
    const token = jwt.sign(
      { id: Liscensingauthority._id, Email_ID: Liscensingauthority.Email_ID },  // Payload data
      process.env.JWT_SECRET,  // Secret key
      { expiresIn: '1h' }  // Token expiry time (1 hour)
    );
    res.status(200).json({ success: true, message: 'Login successful',token: token, LiscensingAuthorityDetails: LiscensingAuthorityDetails });
    } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
     }
  });

    //Dashboard for LiscensingAuthority
    exports.LiscensingAuthorityDashboard =catchAsyncErrors(async (req,res)=>{
      authenticateJWT(req,res,async()=>{
        const { Email_ID } = req.body;
      try {
      // Check if StartupsAvailable exists in the database
      const liscensingAuthority = await Liscensingauthority.findOne({Email_ID});
      
      if(!liscensingAuthority){
        return res.status(404).json({success:false,error:"liscensing Authority not found"});
      }

      const StartupsAvai=await Startup.find({district:liscensingAuthority.district});

      if (StartupsAvai===0) {
      // StartupsAvailable not found, send error response
    
      return res.status(404).json({ StartupRetrievalsuccess: false, error: 'No Startups Available in that district.' });
      
      }
      res.status(200).json({ success: true, Tokensuccess:true , StartupRetrievalsuccess:true,message: 'Startup Details for liscensingAuthority', StartupsAvai: StartupsAvai });
      } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ success: false, error: 'Internal server error' });
       }
      })
    });

    //uploading notification from StartUp into Database
    // LA Notification Post
exports.LANotificationpost = catchAsyncErrors(async (req, res) => {
  const { Startup_Email, NotificationMsgData, Startup_Company } = req.body;

  try {
    // Find the startup by Startup_Email to get the district
    const startup = await Startup.findOne({ Email_ID: Startup_Email });

    if (!startup) {
      return res.status(404).json({ success: false, error: 'Startup not found' });
    }

    // Get the district from the startup
    const { district } = startup;

    // Find thel iscensing Authority by matching the district
    const liscensingAuthority = await Liscensingauthority.findOne({ district });

    if (!liscensingAuthority) {
      return res.status(404).json({ success: false, error: 'liscensing Authority not found for this district' });
    }

    // Create a new LA notification
    const newLANotification = new LA_Notification({
      LA_Email: liscensingAuthority.Email_ID,  // Email of the liscensingAuthority
      Startup_Email: Startup_Email,   // Email of the Startup
      Startup_Company: Startup_Company, // Startup Company Name
      notification: NotificationMsgData,  // Notification message data
      date: new Date()  // Date of notification
    });

    // Save the new notification to the database
    await newLANotification.save();

    // Return success response
    res.status(201).json({ success: true, message: 'Notification posted successfully', data: newLANotification });

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
  const { LA_Email, Startup_Email } = req.body;

  try {
    // Find the notification based on LA_Email and Startup_Email
    const notification = await LA_Notification.findOne({
      LA_Email: LA_Email,
      Startup_Email: Startup_Email
    });

    if (!notification) {
      return res.status(404).json({ success: false, error: 'Notification not found' });
    }

    // Return the NotificationMsgData (notification) and the date
    res.status(200).json({
      success: true,
      message: 'Notification found successfully',
      NotificationMsgData: notification.notification,  // The notification message
      date: notification.date  // The date when the notification was created
    });

  } catch (error) {
    console.error('Error fetching notification:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});


