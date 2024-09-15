const Druginspector = require("../models/drugInspectorModel");// object of drugInspector collection
const Startup=require("../models/startupModel");  //object of Startup collection
const DI_Notification=require("../models/DI_Notification");  //object of DI_Notification collection
const catchAsyncErrors = require("../middleware/catchAsyncErrors"); // by default error catcher
const JWT_SECRET="secret_key_for_StartupPortal";
const Joi = require('joi');

const multer = require("multer");
const path = require("path"); // Used to get file extensions
const fs = require("fs"); // Required for file handling (if needed)
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');

const schema = Joi.object({
  name: Joi.string().min(3).required(),
  phone_number: Joi.number().integer().min(1000000000).max(9999999999).required(),
  password: Joi.string().min(8).pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
  district: Joi.string().required(),
  state: Joi.string().required(),
  crop_name: Joi.string().required(),
  language: Joi.string().optional()
});

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
}


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


// Registration for Drug Inspector
exports.createDrugInspector = catchAsyncErrors(async (req, res) => {
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
    const { error } = schema.validate({ name, Email_ID, password, mobile_no, designation, Qualification, orderReferenceNo, OrderDate, State, district});

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
      const newDruginspector = new Druginspector({
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
      await newDruginspector.save();

      res.status(201).json({ data: newDruginspector, success: true });
    } catch (error) {
      console.error('Error:', error);
      res.status(400).json({ error: error.message, success: false });
    }
  });
});



  //login for DrugInspector
  exports.drugInspectorLogin =catchAsyncErrors(async (req,res)=>{
    const { Email_ID, password } = req.body;
    try {
    // Check if DruginspectorDetails exists in the database
    const DruginspectorDetails = await Druginspector.findOne({ Email_ID });
    
    if (!DruginspectorDetails) {
    // DruginspectorDetails not found, send error response
    
    return res.status(404).json({ success: false, error: 'Invalid Email_ID or password.' });
    
    }
    // Compare passwords
    const passwordMatch = await bcrypt.compare(password, DruginspectorDetails.password);
    if (!passwordMatch) {
    // Passwords don't match, send error response
    return res.status(403).json({ success: false, error: 'Invalid Email_ID or password.' });
    }
    const token = jwt.sign(
      { id: Druginspector._id, Email_ID: Druginspector.Email_ID },  // Payload data
      JWT_SECRET,  // Secret key
      { expiresIn: '1h' }  // Token expiry time (1 hour)
    );
    res.status(200).json({ success: true, message: 'Login successful',token: token, DruginspectorDetails: DruginspectorDetails });
    } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
     }
  });

    //Dashboard for Drug Inspector
    exports.DrugInspectorDashboard =catchAsyncErrors(async (req,res)=>{
      authenticateJWT(req,res,async()=>{
        const { District} = req.body;
      try {
      // Check if StartupsAvailable exists in the database
      const StartupsAvai = await Startup.find({District});
    
      if (!StartupsAvai) {
      // StartupsAvailable not found, send error response
    
      return res.status(404).json({ success: false, error: 'No Startups Available.' });
      
      }
    
      res.status(200).json({ success: true, message: 'Startup Details for DrugInspector', StartupsAvai: StartupsAvai });
      } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ success: false, error: 'Internal server error' });
       }
      })
    });

    //uploading notification from StartUp into Database
    // DI Notification Post
exports.DINotificationpost = catchAsyncErrors(async (req, res) => {
  const { Startup_Email, NotificationMsgData, Startup_Company } = req.body;

  try {
    // Find the startup by Startup_Email to get the district
    const startup = await Startup.findOne({ Email_ID: Startup_Email });

    if (!startup) {
      return res.status(404).json({ success: false, error: 'Startup not found' });
    }

    // Get the district from the startup
    const { district } = startup;

    // Find the Drug Inspector by matching the district
    const drugInspector = await Druginspector.findOne({ district });

    if (!drugInspector) {
      return res.status(404).json({ success: false, error: 'Drug Inspector not found for this district' });
    }

    // Create a new DI notification
    const newDINotification = new DI_Notification({
      DI_Email: drugInspector.Email_ID,  // Email of the Drug Inspector
      Startup_Email: Startup_Email,   // Email of the Startup
      Startup_Company: Startup_Company, // Startup Company Name
      notification: NotificationMsgData,  // Notification message data
      date: new Date()  // Date of notification
    });

    // Save the new notification to the database
    await newDINotification.save();

    // Return success response
    res.status(201).json({ success: true, message: 'Notification posted successfully', data: newDINotification });

  } catch (error) {
    console.error('Error during notification post:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});


// Function to return startups for a given Drug Inspector
exports.DINotificationSendingStartups = catchAsyncErrors(async (req, res) => {
  const { Email_ID } = req.body; // Extract Drug Inspector email from the request body
  
  try {
    // Find all notifications where the DI_Email matches the provided email
    const notifications = await DI_Notification.find({ Email_ID });

    if (!notifications || notifications.length === 0) {
      return res.status(404).json({ success: false, message: 'No startups found for the given Drug Inspector email.' });
    }

    // Extract Startup Emails and Company names into a list
    const startupDetails = notifications.map(notification => ({
      Startup_Email: notification.Startup_Email,
      Startup_Company: notification.Startup_Company
    }));

    // Return the list of startup details
    res.status(200).json({
      success: true,
      message: 'List of startups associated with the Drug Inspector',
      data: startupDetails
    });

  } catch (error) {
    console.error('Error fetching startups:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});


// Function to get the notification based on DI_Email and Startup_Email
exports.DI_NotificationGet = catchAsyncErrors(async (req, res) => {
  const { DI_Email, Startup_Email } = req.body;

  try {
    // Find the notification based on DI_Email and Startup_Email
    const notification = await DI_Notification.findOne({
      DI_Email: DI_Email,
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


