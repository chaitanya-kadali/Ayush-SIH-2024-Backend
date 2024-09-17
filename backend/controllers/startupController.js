const bcrypt=require("bcryptjs");  //object for password hashing
const Startup = require("../models/startupModel"); // object of Startup collection
const StartupdashModel=require("../models/StartupDashModel");  //object for StartupDashboard Collection 
const Farmer = require("../models/farmerModel");  //object of Farmer collection
const Doctor = require("../models/doctormodel");  //object of Doctor collection
const catchAsyncErrors = require("../middleware/catchAsyncErrors"); // by default error catcher
const {Startupschema}=require("../middleware/schemaValidator");  //validate Doctor schema 
const Status = require("../models/applicationStatus");
const { GridFSBucket } = require('mongodb');
const mongoose = require('mongoose');
require('dotenv').config();

const multer = require("multer");//object for pdf uploading
// Multer setup
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const jwt = require('jsonwebtoken');  //object to Generate JWT token


//Registration for the start up
exports.createStartUp = catchAsyncErrors( async (req, res) => {

  const {Email_ID,password,companyName,address ,city,pinCode,
    state,district,phone_number}=req.body;
    const Email_Validation=await Startup.findOne({Email_ID});
    const PHno_Validation=await Startup.findOne({phone_number});
    
    if(Email_Validation){
      return res.status(404).json({success :false,message:"Email already exists",error:"Email already exists"});
    }

    if(PHno_Validation){
      return res.status(404).json({success:false,message:"phone number already exists",error:"phone number already exists"});
    }

    // Validate the request body using Joi
    const { error } = Startupschema.validate({ Email_ID,password,companyName,address ,city,pinCode,
      state,district,phone_number});
  if (error) {
    // If validation fails, return the error message
    console.log("schema not validated");
    return res.status(400).json({ success: false, message:"schema or password not validated", message2: error.details[0].message });
  }
  try {
    
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    // Create new user instance with hashed password
    const newStatus= new Status({
      Email_ID:Email_ID,
      FilledApplicationL:false,
      FilledAplicationAccepted:false,
      isDrugInspectorAssigned:false,
      isDrugInspectorAccepted:false,
      isLicensed:false
    })
    const NewstartUp = new Startup({Email_ID,password:hashedPassword,companyName,address ,city,pinCode,
      state,district,phone_number,role:"Startup"});

    // Save the user to the database
    await NewstartUp.save();
    await newStatus.save();

    res.status(201).json({data:NewstartUp, success:true,message:"Startup successfully created"});
  } catch (error) {
    console.error('Error:', error);
    res.status(400).json({ error: error.message , success:false});
  }
});

//Dashboard for the start up
exports.Startup_Dashboard = catchAsyncErrors(async (req, res) => {
  const uploadMiddleware = upload.fields([
    { name: 'pdf1', maxCount: 1 },
    { name: 'pdf2', maxCount: 1 }
  ]);

  uploadMiddleware(req, res, async (err) => {
    if (err) {
      return res.status(500).send(err.message);
    }

    // Check if both files are uploaded
    if (!req.files || !req.files['pdf1'] || !req.files['pdf2']) {
      return res.status(400).send('Both PDF files must be uploaded.');
    }

    const { Email, PANno, GSTno, websiteAddress, certificateNo, CompanyDOI, IssuuingAuthority, IE_code, IE_DOI, feedback } = req.body;

    try {
      // Get the file buffers of the uploaded PDFs
      const pdf1Buffer = req.files['pdf1'][0].buffer;
      const pdf2Buffer = req.files['pdf2'][0].buffer;

      const db = mongoose.connection.db;
      const bucket = new GridFSBucket(db);

      // Upload pdf1 to GridFS
      const uploadStream1 = bucket.openUploadStream(req.files['pdf1'][0].originalname);
      uploadStream1.end(pdf1Buffer);

      // Upload pdf2 to GridFS
      const uploadStream2 = bucket.openUploadStream(req.files['pdf2'][0].originalname);
      uploadStream2.end(pdf2Buffer);

      // Store file IDs and other details after uploads complete
      uploadStream1.on('finish', () => {
        uploadStream2.on('finish', async () => {
          // Create a new Startup Dashboard model with the uploaded PDFs' file IDs
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
            pdf1: uploadStream1.id, // Save the GridFS file ID for pdf1
            pdf2: uploadStream2.id, // Save the GridFS file ID for pdf2
            feedback,
            role: "Startup",
            date: Date.now()
          });

          // Save the Startup Dashboard to the database
          await newStartupdashModel.save();
          res.status(201).json({ success: true, message: 'Dashboard details successfully saved', newStartupdashModel: newStartupdashModel });
        });
        
        uploadStream2.on('error', (err) => {
          res.status(500).send('Error uploading second PDF: ' + err.message);
        });
      });

      uploadStream1.on('error', (err) => {
        res.status(500).send('Error uploading first PDF: ' + err.message);
      });

    } catch (error) {
      console.error('Error:', error);
      res.status(400).json({ error: error.message });
    }
  });
});
//login for Startup

exports.StartupLogin =catchAsyncErrors(async (req,res)=>{
    const { Email_ID, password } = req.body;
    try // Check if user exists in the Database
    {    const StartupDetails = await Startup.findOne({ Email_ID });
        if (!StartupDetails) {
        // User not found, send error response
        console.log("email and user not found !!");
        return res.status(404).json({ success: false,throwmsg:"email not found !!", error: 'User not found or Invalid Email_ID.' });
        }
        // Compare passwords
        const passwordMatch = await bcrypt.compare(password, StartupDetails.password);
        if (!passwordMatch) {
        // Passwords don't match, send error response
        console.log("Password did'nt match !!");
        return res.status(403).json({ success: false, throwmsg:"Password did'nt match !!",error: 'Invalid Email_ID or password.' });
        }

        const token = jwt.sign(
          { id: StartupDetails._id, Email_ID: StartupDetails.Email_ID },  // Payload data
          process.env.JWT_SECRET,  // Secret key
          { expiresIn: '4h' }  // Token expiry time (4 hour) changed to 4 hours
        );
        
        res.status(201).json({ success: true, message: 'Login successful',token: token, StartupDetails: StartupDetails });
    
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
          feedback,
          role:"Startup",
          date:date.now()
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
  exports.Startup_farmer_tab =catchAsyncErrors(async (req,res)=>{
       console.log("line 152 varuku called");
            const { Email_ID } = req.body;
          try {
                // Check if user exists in the database
                const startup = await Startup.findOne({Email_ID});
                                      if (!startup) {
                                        // User not found, send error response
                                        return res.status(404).json({ startupfound: false, error: 'No Startups Available. with the sent email' }); // no possible chances for this to happen
                                      }
                const FarmersAvail = await Farmer.find({district:startup.district});
                if(FarmersAvail.length===0){
                  console.log("No Farmers Available in this Startups district.");
                return res.status(200).json({farmerRetrievalSuccess:false, message: 'No Farmers Available in this Startups district.'}) // status should be 200 as no farmer is not an error
                }
                console.log("here i am :",FarmersAvail);
                
                res.status(200).json({farmerRetrievalSuccess:true, Farmerslist: FarmersAvail });// considering tokensuccess : true was already sent before
            } catch (error) {
                  console.error('Error during farmer data fetch at startup dashboard:', error);
                  res.status(500).json({ success: false, error: 'Internal server error' });
             }
        
    });

      //DashBoard for Startup-doctor
  exports.Startup_docter_tab =catchAsyncErrors(async (req,res)=>{
      const { Email_ID } = req.body;
      try {
      // Check if user exists in the database
      const startup = await Startup.findOne({Email_ID});
      if (!startup) {
      // User not found, send error response
      return res.status(404).json({ success: false, error: 'No Startup Available.' });
      }
      const DoctorsAvai = await Doctor.find({district:startup.district});

      if(DoctorsAvai.lenght===0){
        res.status(404).json({DoctorRetrievalSuccess:false,error: 'No Doctors Available in this Startup\'s district.'})
      }
      
        res.json({ success: true,DoctorRetrievalSuccess:true, message: 'The Doctors Details for Startup', DoctorsAvai: DoctorsAvai });
        } catch (error) {
        console.error('Error during doctor dashboard:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
         }
  });
      
  
// Uploading Feedback from liscensingAuthority into Database
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

// Uploading Feedback from liscensingAuthority into Database
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
