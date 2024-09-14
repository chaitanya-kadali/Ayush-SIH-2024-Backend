const Druginspector = require("../models/drugInspectorModel");// object of drugInspector collection
const Startup=require("../models/startupModel");  //object of Startup collection
const DI_Notification=require("../models/DI_Notification");  //object of DI_Notification collection
const catchAsyncErrors = require("../middleware/catchAsyncErrors"); // by default error catcher
const bcrypt=require("bcryptjs");

const multer = require("multer");

// Configure Multer to save files to the server
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./files");  // Set the directory where you want to save the files
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);  // Set the file name to save
  }
});
const upload = multer({ storage: storage });


// Registration for Druginspector
exports.createDrugInspector = catchAsyncErrors(async (req, res) => {

    const uploadMiddleware = upload.single('OrderPdfCopy');

  // Invoke the multer middleware manually
  uploadMiddleware(req, res, async (err) => {
    if (err) {
      return res.status(500).send(err.message);
    }
    if (!req.file) {
      return res.status(400).send('No file uploaded.');
    }

    const { name, Email_ID, password,mobile_no,designation,Qualification,orderReferenceNo,OrderDate,State,district} = req.body;

    try {
      // Hash the password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Get the file path of the uploaded PDF
      const pdfFilePath = req.file.path;

      // Create a new Druginspector with the uploaded PDF's file path
      const newDruginspector = new Druginspector({
        name, 
        Email_ID, 
        password:hashedPassword,
        mobile_no,
        designation,
        Qualification,
        orderReferenceNo,
        OrderDate,
        OrderPdfCopy:pdfFilePath,
        State,
        district
      }
    );

      // Save the drugInspector to the database
      await newDruginspector.save();
  
      res.status(201).json({data:newDruginspector, success: true}); 
    } catch (error) {
      console.error('Error:', error);
      res.status(400).json({ error: error.message,success: false });
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
    res.status(200).json({ success: true, message: 'Login successful', DruginspectorDetails: DruginspectorDetails });
    } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
     }
  });

    //Dashboard for Drug Inspector
    exports.DrugInspectorDashboard =catchAsyncErrors(async (req,res)=>{
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


