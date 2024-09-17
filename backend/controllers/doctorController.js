
const express=require("express");

const { GridFSBucket } = require('mongodb');
const mongoose = require('mongoose');

const bcrypt = require('bcryptjs'); // object for password hashing
const Doctor = require("../models/doctormodel"); // object of doctor collection
const Startup = require("../models/startupModel");// object of startup collection
const catchAsyncErrors = require("../middleware/catchAsyncErrors"); // by default error catcher
const authenticateJWT = require("../middleware/authMiddleware");  //validate the Token after login
const { Doctorschema } = require("../middleware/schemaValidator");
const multer = require("multer");  //object for pdf uploading
require('dotenv').config();

const jwt = require('jsonwebtoken');  //object to Generate JWT token 

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Registration for doctor
exports.createDoctor = catchAsyncErrors(async (req, res) => {
  const uploadMiddleware = upload.single('pdf');

  // Invoke the multer middleware manually
  uploadMiddleware(req, res, async (err) => {
    if (err) {
      return res.status(500).send(err.message);
    }
    if (!req.file) {
      return res.status(400).send('No file uploaded.');
    }

    const { name, Email_ID, password, district, state, phone_number, language } = req.body;

    const Email_Validation = await Doctor.findOne({ Email_ID });
    const PHno_Validation = await Doctor.findOne({ phone_number });

    if (Email_Validation) {
      return res.status(404).json({ success: false, error: "Email_ID already exists" });
    }

    if (PHno_Validation) {
      return res.status(404).json({ success: false, error: "Phone number already exists " });
    }

    // Validate the request body using Joi
    // const { error } = Doctorschema.validate({ name, Email_ID, password, district, state, phone_number, language });

    // if (error) {
    //   // If validation fails, return the error message
    //   return res.status(400).json({ success: false, error: error.details[0].message });
    // }

    try {
      // Hash the password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const db = mongoose.connection.db;
      const bucket = new GridFSBucket(db);
      const pdfBuffer = req.file.buffer;
      const uploadStream = bucket.openUploadStream(req.file.originalname);

      uploadStream.end(pdfBuffer);

      uploadStream.on('finish', async () => {
        // After the PDF is uploaded, save the doctor record
        const newDoctor = new Doctor({
          name,
          Email_ID,
          password: hashedPassword,
          district,
          state,
          phone_number,
          language,
          pdf: uploadStream.id, // Save the GridFS file ID
          role: "Doctor"
        });

        await newDoctor.save();
        res.status(201).json(newDoctor);
      });

      uploadStream.on('error', (err) => {
        res.status(500).send('Error uploading PDF: ' + err.message);
      });

    } catch (error) {
      console.error('Error:', error);
      res.status(400).json({ error: error.message, success: false });
    }
  });
});



  //Login for doctor
  exports.DoctorLogin =catchAsyncErrors(async (req,res)=>{
    const { Email_ID, password } = req.body;
    try {
    // Check if Doctor exists in the database
    const DoctorDetails = await Doctor.findOne({ Email_ID });

    if (!DoctorDetails) {
    // Doctor Details not found, send error response

    return res.status(404).json({ success: false, error: 'Invalid Email_ID or password.' });

    }
    // Compare passwords
    const passwordMatch = await bcrypt.compare(password, DoctorDetails.password);
    if (!passwordMatch) {

    // Passwords don't match, send error response
    return res.status(403).json({ success: false, error: 'Invalid Email_ID or password.' });
    }
    const token = jwt.sign(
      { id: DoctorDetails._id, Email_ID: DoctorDetails.Email_ID },  // Payload data
      process.env.JWT_SECRET,  // Secret key
      { expiresIn: '1h' }  // Token expiry time (1 hour)
    );

    res.json({ success: true, message: 'Login successful' ,token: token, DoctorDetails: DoctorDetails });
    }
    catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
     }
  });


  //Doctor Dashboard
  exports.DoctorDashboard =catchAsyncErrors(async (req,res)=>{
    authenticateJWT(req,res,async()=>{
    const { Email_ID } = req.body;
    try {
    // Check if startups exists in the database
    const doctor = await Doctor.findOne({Email_ID});

    if(!doctor){
      return res.status(404).json({success:false,error:"Doctor not found"});
    }
    const StartupsAvai=await Startup.find({district: doctor.district});
    if (StartupsAvai.lenght===0) {
    
    return res.status(404).json({ StartupRetrievalsuccess: false, error: 'No Startups Available.' });
  
    }
    res.json({ success: true, Tokensuccess:true, StartupRetrievalsuccess: true, message: 'Startup Details for doctor', StartupsAvai: StartupsAvai});
    } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
     }
    })
  });