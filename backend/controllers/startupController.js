const Startup = require("../models/startupModel"); // object of Startup collection
const StartupdashModel=require("../models/StartupDashModel");  //object for StartupDashboard Collection 
const Farmer = require("../models/farmerModel");  //object of Farmer collection
const Doctor = require("../models/doctormodel");  //object of Doctor collection
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

//Registration for the start up
exports.createStartUp = catchAsyncErrors( async (req, res) => {
  const {Email_ID,password,companyName,address ,city,pinCode,
    state,district}=req.body;
  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    // Create new user instance with hashed password
    const NewstartUp = new Startup({Email_ID,password:hashedPassword,companyName,address ,city,pinCode,
      state,district});

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
    res.json({ success: true, message: 'Login successful', StartupDetails: StartupDetails });
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

      const { PANno,GSTno,websiteAddress,certificateNo,CompanyDOI,IssuuingAuthority,IE_code,IE_DOI } = req.body;

      try {

        // Get the file paths of the uploaded PDFs
        const pdf1FilePath = req.files['pdf1'][0].path;
        const pdf2FilePath = req.files['pdf2'][0].path;

        // Create a new doctor with the uploaded PDFs' file paths
        const newStartupdashModel = new StartupdashModel({
          PANno,
          GSTno,
          websiteAddress,
          certificateNo,
          CompanyDOI,
          IssuuingAuthority,
          IE_code,
          IE_DOI,
          pdf1: pdf1FilePath,
          pdf2: pdf2FilePath
        });

        // Save the doctor to the database
        await newStartupdashModel.save();

        res.status(201).json(newStartupdashModel);
      } catch (error) {
        console.error('Error:', error);
        res.status(400).json({ error: error.message });
      }
    });
  })

  //DashBoard for Startup-farmer
    exports.StartupF_Dashboard =catchAsyncErrors(async (req,res)=>{
      const { District} = req.body;
      try {
      // Check if user exists in the database
      const FarmersAvai = await Farmer.find({District});
      
      if (!FarmersAvai) {
      // User not found, send error response
    
      return res.status(404).json({ success: false, error: 'No Startups Available.' });
    
      }
      
      res.status(200).json({ success: true, message: 'Farmer Details for Startup', FarmersAvai: FarmersAvai });
      } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ success: false, error: 'Internal server error' });
       }
    });

      //DashBoard for Startup-doctor
      exports.StartupD_Dashboard =catchAsyncErrors(async (req,res)=>{
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
      });
  