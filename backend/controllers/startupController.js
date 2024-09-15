const bcrypt=require("bcryptjs");  //object for password hashing
const Startup = require("../models/startupModel"); // object of Startup collection
const StartupdashModel=require("../models/StartupDashModel");  //object for StartupDashboard Collection 
const Farmer = require("../models/farmerModel");  //object of Farmer collection
const Doctor = require("../models/doctormodel");  //object of Doctor collection
const catchAsyncErrors = require("../middleware/catchAsyncErrors"); // by default error catcher
const authenticateJWT=require("../middleware/authMiddleware");  //validate the Token after login
const {Startupschema}=require("../middleware/schemaValidator");  //validate Doctor schema 
require('dotenv').config();

const multer = require("multer");//object for pdf uploading

const jwt = require('jsonwebtoken');  //object to Generate JWT token


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


//Registration for the start up
exports.createStartUp = catchAsyncErrors( async (req, res) => {
  const {Email_ID,password,companyName,address ,city,pinCode,
    state,district,phone_number}=req.body;
    // Validate the request body using Joi
    const { error } = Startupschema.validate({ Email_ID,password,companyName,address ,city,pinCode,
      state,district,phone_number});

  if (error) {
    // If validation fails, return the error message
    return res.status(400).json({ success: false, error: error.details[0].message });
  }
  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    // Create new user instance with hashed password
    const NewstartUp = new Startup({Email_ID,password:hashedPassword,companyName,address ,city,pinCode,
      state,district,phone_number});

    // Save the user to the database
    await NewstartUp.save();

    res.status(201).json({data:NewstartUp, success:true,message:"Startup successfully created"});
  } catch (error) {
    console.error('Error:', error);
    res.status(400).json({ error: error.message , success:false});
  }
});

//login for Startup

  exports.StartupLogin =catchAsyncErrors(async (req,res)=>{
    const { Email_ID, password } = req.body;
    try {
    // Check if user exists in the Database
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

    const token = jwt.sign(
      { id: StartupDetails._id, Email_ID: StartupDetails.Email_ID },  // Payload data
      process.env.JWT_SECRET,  // Secret key
      { expiresIn: '1h' }  // Token expiry time (1 hour)
    );

    res.json({ success: true, message: 'Login successful',token: token, StartupDetails: StartupDetails });

    } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
     }
  });


  //Startup real DashBoard
  exports.Startup_Dashboard=catchAsyncErrors(async (req,res)=>{
    // const { PANno,GSTno,websiteAddress,certificateNo,CompanyDOI,IssuuingAuthority,IE_code,IE_DOI }=req.body;
    const uploadMiddleware = upload.fields([
      { name: 'pdf1', maxCount: 1 },
      { name: 'pdf2', maxCount: 1 }
    ]);

    // Invoke the multer middleware manually
    uploadMiddleware(req, res, async (err) => {
      if (err) {
        return res.status(500).send(err.message);
      }
      
      // Check if both files are uploaded
      if (!req.files || !req.files['pdf1'] || !req.files['pdf2']) {
        return res.status(400).send('Both PDF files must be uploaded.');
      }

      const { Email, PANno, GSTno, websiteAddress, certificateNo, CompanyDOI, IssuuingAuthority, IE_code, IE_DOI ,feedback} = req.body;

      try {

        // Get the file paths of the uploaded PDFs
        const pdf1FilePath = req.files['pdf1'][0].path;
        const pdf2FilePath = req.files['pdf2'][0].path;

        // Create a new Startup DashBoard model with the uploaded PDFs' file paths
        const newStartupdashModel = new StartupdashModel({
          Email,
          PANno,
          GSTno,
          websiteAddress,
          certificateNo,
          CompanyDOI,
          IssuuingAuthority,
          IE_code,
          IE_DOI,
          pdf1: pdf1FilePath,
          pdf2: pdf2FilePath,
          feedback
        });

        // Save the StartupDashBoard to the database
        await newStartupdashModel.save();

        res.status(201).json({ success: true, message: 'Dashboard details successfuly daved', newStartupdashModel: newStartupdashModel });
      } catch (error) {
        console.error('Error:', error);
        res.status(400).json({ error: error.message });
      }
    });
  });

  //DashBoard for Startup-farmer
    exports.StartupF_Dashboard =catchAsyncErrors(async (req,res)=>{
      //  Authenticate user before proceeding
      authenticateJWT(req,res,async()=>{
        const { District} = req.body;
      try {
      // Check if user exists in the database
      const FarmersAvai = await Farmer.find({District});
      
      if (!FarmersAvai) {
      // User not found, send error response
    
      return res.status(404).json({ success: false, error: 'No Farmers Available.' });
    
      }
      
      res.status(200).json({ success: true, message: 'Farmer Details for Startup', FarmersAvai: FarmersAvai });
      } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ success: false, error: 'Internal server error' });
       }
      })
    });

      //DashBoard for Startup-doctor
      exports.StartupD_Dashboard =catchAsyncErrors(async (req,res)=>{
        authenticateJWT(req,res,async()=>{
          const { district} = req.body;
        try {
        // Check if user exists in the database
        const DoctorsAvai = await Doctor.find({district});
      
        if (!DoctorsAvai) {
        // User not found, send error response
      
        return res.status(404).json({ success: false, error: 'No Doctors Available.' });
      
        }
      
        res.json({ success: true, message: 'Doctors Details for Startup', DoctorsAvai: DoctorsAvai });
        } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
         }
        })
      });
  
// Uploading Feedback from DrugInspector into Database
exports.StartupFeedback_upload = catchAsyncErrors(async (req, res) => {
  const { Email, feedback } = req.body;
  
  try {

    // Find the startup by email
    const StartUp = await StartupdashModel.findOne({ Email });

    // Check if the startup exists
    if (!StartUp) {
      return res.status(404).json({ success: false, message: 'Startup not found' });
    }

    // Update the feedback field
    if(StartUp.feedback){
      StartUp.feedback=StartUp.feedback+"\n"+feedback;
    }else{
      StartUp.feedback=feedback;
    }

    // Save the updated startup to the database
    await StartUp.save();

    // Return a success response
    res.status(200).json({ success: true, message: 'Feedback updated successfully', data: StartUp });
  } catch (error) {
    console.error('Error during feedback update:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// Uploading Feedback from DrugInspector into Database
exports.StartupFeedback_Get = catchAsyncErrors(async (req, res) => {
  const { Email } = req.body;
  
  try {
    // Find the startup by email
    const StartUp = await StartupdashModel.findOne({ Email });

    // Check if the startup exists
    if (!StartUp) {
      return res.status(404).json({ success: false, message: 'Startup not found' });
    }

    // Return a success response
    res.status(200).json({ success: true, message: 'Startup found ', data: StartUp.feedback });
  } catch (error) {
    console.error('Error during feedback update:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});
