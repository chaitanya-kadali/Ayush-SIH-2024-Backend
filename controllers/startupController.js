const bcrypt=require("bcryptjs");  //object for password hashing
const Startup = require("../models/startupModel"); // object of Startup collection
const StartupdashModel=require("../models/StartupDashModel");  //object for StartupDashboard Collection 
const Farmer = require("../models/farmerModel");  //object of Farmer collection
const Doctor = require("../models/doctormodel");  //object of Doctor collection
const catchAsyncErrors = require("../middleware/catchAsyncErrors"); // by default error catcher
const {Startupschema}=require("../middleware/schemaValidator");  //validate Doctor schema 
const Status = require("../models/applicationStatus");
require('dotenv').config();
const axios = require("axios");


const jwt = require('jsonwebtoken');  //object to Generate JWT token

//Registration for the start up
exports.createStartUp= catchAsyncErrors( async (req, res) => {

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
    FilledApplication : false,	AplicationAccepted : false, 	ApplicationRejected :false,	
  isDrugInspectorAssigned: false,	isDrugInspectorAccepted : false, 	isDrugInspectorRejected : false,
	isLicensed: false
    });

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

//Dashboard for the start up
exports.Startup_Dashboard_Create = catchAsyncErrors(async (req, res) => {

  const { Email, PANno, GSTno, websiteAddress, certificateNo, CompanyDOI, IssuuingAuthority, IE_code, IE_DOI } = req.body;

  try {
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
          role: "Startup"
        });
        const verifyEmail=await Status.findOne({Email_ID:Email});
        verifyEmail.FilledApplication=true;
        await verifyEmail.save();
        // Save the Startup Dashboard to the database
        await newStartupdashModel.save();
        res.status(201).json({ success: true, message: 'Dashboard details successfully saved', newStartupdashModel: newStartupdashModel });
      } catch (error) {
    console.error('Error:', error);
    res.status(400).json({ error: error.message });
  }
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
exports.StartupFeedback_post = catchAsyncErrors(async (req, res) => {
  const { Email, feedback } = req.body; //Startup Email_ID
  
  try {

    // Find the startup by email
    const StartUp = await StartupdashModel.findOne({ Email });

    // Check if the startup exists
    if (!StartUp) {
      return res.status(404).json({ success: false, message: 'Startup not found' });
    }

    console.log("Startup email",Email);
    const message = feedback;
    const response =await axios.post("http://localhost:5002/api/send-email",{ email:Email, message:feedback });
    if(!response.data.success){
      console.log("eror : email is not sent");
    }

    StartUp.feedback.push(feedback);
    console.log("201 : ",StartUp.feedback);
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
    console.log("220 ");
    // Find the startup by email
    const StartUpdash = await StartupdashModel.findOne({ Email });
    console.log("220 ", StartUpdash);
    
    // Return a success response
    res.status(200).json({ success: true, message: 'Startup found ', data: StartUpdash.feedback });
  } catch (error) {
    console.error('Error during feedback update:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

exports.StartupDashInfoRetrieval = catchAsyncErrors(async(req,res)=>{
  const { Email_ID }=req.body;
  const Email  = Email_ID; //in statupdash model schema email is as "Email"
  try{
    const VerifyEmail=await StartupdashModel.findOne({Email});
    if(!VerifyEmail){
      console.log("Dash Model Doesn\'t exist",Email_ID);
      return res.status(202).json({success:false,message:"Startup Dash Model Doesn\'t exist",data:[]});
    }
    const StartupDetails=await StartupdashModel.find({Email});
    // console.log("Dash Model exist",StartupDetails);
    return res.status(201).json({success:true,message:"Startup Dash details",data:StartupDetails});
  }
  catch{
    console.error('Error during feedback update:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
})

// getbasic details
exports.StartupBaisic= catchAsyncErrors(async (req, res) => {
  const { Email_ID } = req.body;
  
  try {
    // Find the startup by email
    const StartUp = await Startup.findOne({ Email_ID});
    console.log(StartUp,"jdndn    -------------- \n\n\n\n");
    // Return a success response
    res.status(200).json({ success: true, message: 'Startup found ', basicdata: StartUp });
  } catch (error) {
    console.error('Error during:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

exports.EditStartupDash = catchAsyncErrors(async (req, res) => {
  try {
    const email = req.params.email;  // Using email from params
    const updates = req.body;  // The new data sent from the client

    // Find the current startup document by email
    const existingStartup = await StartupdashModel.findOne({ Email: email });
    if (!existingStartup) {
      return res.status(404).json({ success: false, message: 'Startup not found' });
    }

    // Create an object to store fields that have changed
    const updatedFields = {};
    const changedAttributes = [];

    // Check which fields have changed and update only those fields
    for (const key in updates) {
      if (updates[key] && updates[key] !== existingStartup[key]) {
        updatedFields[key] = updates[key];  // Add the changed field to the update object
        changedAttributes.push(key);        // Track the changed attribute
      }
    }

    // If no fields are updated
    if (Object.keys(updatedFields).length === 0) {
      return res.status(400).json({ success: false, message: 'No fields to update' });
    }

    // Update the startup document with only the changed fields
    const updatedStartup = await StartupdashModel.findOneAndUpdate(
      { Email: email },
      { $set: updatedFields },
      { new: true }
    );

    const verifyEmail=await Status.findOne({Email_ID:email});
        verifyEmail.FilledApplication=true;
        await verifyEmail.save();
    // Return the updated document along with the changed attributes
    res.status(200).json({
      success: true,
      message: 'Startup updated successfully',
      changedAttributes: changedAttributes,  // Include the list of updated fields in the response
      data: updatedStartup
    });
  } catch (error) {
    // Catch any errors that occur during the operation
    console.error('Error updating startup:', error);
    res.status(500).json({ success: false, message: 'Error updating startup', error: error.message });
  }
});

