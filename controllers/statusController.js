const Status = require("../models/applicationStatus");
const LA_Notification=require("../models/LA_Notification");

const catchAsyncErrors = require("../middleware/catchAsyncErrors"); // by default error catcher

exports.isNotAssigned = catchAsyncErrors(async (req, res) => {

    console.log("isNotAssigned");
    try {
        const statusList = await Status.find(
            { FilledApplication:true, AplicationAccepted : false, 
               isDrugInspectorAssigned: false,
                isDrugInspectorAccepted : false,isDrugInspectorRejected : false,
                isLicensed: false}, 
            { Email_ID: 1, _id: 0 } // Only return Email_ID, omit _id
        );
        // Check if any results were found
        if (statusList.length === 0) {
            return res.status(200).json({ success: true, pendingList: [], message: 'No emails found' });
        }                 //200           // true is the only thing to do . empty emails is acceptable 

        // Return the list of emails
        res.status(200).json({ success: true, pendingList:statusList, message: 'Success' });

    } catch (error) {
        console.error('Error during fetching startups:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});


exports.isAssigned = catchAsyncErrors(async (req, res) => {

    console.log("Fetching list of assigned Drug Inspectors");
    try {
        const statusList = await Status.find(
            { isDrugInspectorAssigned: true ,isDrugInspectorAccepted : false,isDrugInspectorRejected : false,
                }, // Filter condition
            { Email_ID: 1, _id: 0 } // Only return Email_ID, omit _id
        );
        // Check if any results were found
        if (statusList.length === 0) {
            return res.status(200).json({ success: true, assignedList: [], message: 'No emails found' });
        }                 //200           // true is the only thing to do . empty emails is acceptable 

        // Return the list of emails
        res.status(200).json({ success: true, assignedList: statusList, message: 'Success' });

    } catch (error) {
        console.error('Error during fetching startups:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});



// isDrugInspectorAccepted-true

exports.isAccepted = catchAsyncErrors(async (req, res) => {

    console.log("Fetching list of assigned Drug Inspectors");
    try {
        const statusList = await Status.find(
            { isDrugInspectorAccepted: true,isLicensed: false }, // Filter condition
            { Email_ID: 1, _id: 0 } // Only return Email_ID, omit _id
        );
        // Check if any results were found
        if (statusList.length === 0) {
            return res.status(200).json({ success: true, acceptedList: [], message: 'No emails found' });
        }                 //200           // true is the only thing to do . empty emails is acceptable 

        // Return the list of emails
        res.status(200).json({ success: true, acceptedList: statusList, message: 'Success' });

    } catch (error) {
        console.error('Error during fetching startups:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});


// isDrugInspectorRejected
exports.isRejected = catchAsyncErrors(async (req, res) => {

    try {
        const statusList = await Status.find(
            { isDrugInspectorRejected: true }, // Filter condition
            { Email_ID: 1, _id: 0 } // Only return Email_ID, omit _id
        );
        // Check if any results were found
        if (statusList.length === 0) {
            return res.status(200).json({ success: true, rejectedList: [], message: 'No emails found' });
        }                 //200           // true is the only thing to do . empty emails is acceptable 

        // Return the list of emails
        res.status(200).json({ success: true, rejectedList: statusList, message: 'Success' });

    } catch (error) {
        console.error('Error during fetching startups:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

exports.isLARejected = catchAsyncErrors(async (req, res) => {

    try {
        const statusList = await Status.find(
            { ApplicationRejected: true }, // Filter condition
            { Email_ID: 1, _id: 0 } // Only return Email_ID, omit _id
        );
        // Check if any results were found
        if (statusList.length === 0) {
            return res.status(200).json({ success: true, datal: [], message: 'No emails found' });
        }                 //200           // true is the only thing to do . empty emails is acceptable 

        // Return the list of emails
        res.status(200).json({ success: true, datal: statusList, message: 'Success' });

    } catch (error) {
        console.error('Error during fetching startups:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

// isLicensed-true
exports.isLicensed = catchAsyncErrors(async (req, res) => {

    try {
        const statusList = await Status.find(
            { isLicensed: true }, // Filter condition
            { Email_ID: 1, _id: 0 } // Only return Email_ID, omit _id
        );
        // Check if any results were found
        if (statusList.length === 0) {
            return res.status(200).json({ success: true, licensedList: [], message: 'No emails found' });
        }                 //200           // true is the only thing to do . empty emails is acceptable 

        // Return the list of emails
        res.status(200).json({ success: true, licensedList: statusList, message: 'Success' });

    } catch (error) {
        console.error('Error during fetching startups:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});
exports.isNotifyEligible = catchAsyncErrors(async (req, res) => {
    const { Startup_Email } = req.body;
    try {
        console.log("is notify elgble  ",Startup_Email);
        const Startup_Exist = await LA_Notification.findOne({ Startup_Email });
        
        if (!Startup_Exist) {
            return res.status(201).json({ success: true });
        }
        console.log("donndddfsgd");
        const storedDate = Startup_Exist.date; // Ensure date is a Date object
        console.log("donnddd");
        const dateFromString = new Date(storedDate);

        const currentDate = new Date();
        
        // Calculate the difference in milliseconds
        const differenceInMilliseconds = currentDate - dateFromString;

        // Convert the difference to days
        const differenceInDays = Math.floor(differenceInMilliseconds / (1000 * 60 * 60 * 24));

        // Check if the difference is less than or equal to 2 days
        if (differenceInDays <= 2 |differenceInDays=="NaN") {
            return res.status(404).json({ success: false }); // Adjusted status code and json call
        }

        return res.status(200).json({ success: true });
    } catch (error) { // Included error parameter
        console.error('Error during fetching startups:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});



exports.statusTrackpad = catchAsyncErrors(async (req, res) => {
    const { Startup_Email } = req.body;
    try {
       const  Email_ID = Startup_Email;
       const statusData = await Status.find({ Email_ID });
       console.log(statusData);
       res.status(200).json({ success: true,statusInfo:statusData, message: 'Success'});
    } catch (error) { // Included error parameter
        console.error('Error during fetching startups:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

exports.makeItAssigned=catchAsyncErrors(async(req,res)=>{
    const { Email_ID }=req.body;
    try{
        const VerifyEmail=await Status.findOne({Email_ID:Email_ID});
        if(!VerifyEmail){
            return res.status(404).json({success:false,message:"Stratup not Found"});
        }
        VerifyEmail.isDrugInspectorAssigned=true;
        await VerifyEmail.save();
        return res.status(201).json({success:true,message:"successfully assgined true foor drug inspector"});
    }
    catch(error){
        console.error('Error during fetching startups:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

exports.makeItAccepted=catchAsyncErrors(async(req,res)=>{
    const { Email_ID }=req.body;
    try{
        const VerifyEmail=await Status.findOne({Email_ID:Email_ID});
        if(!VerifyEmail){
            return res.status(404).json({success:true,message:"Stratup not Found"});
        }
        VerifyEmail.isDrugInspectorAccepted=true;
        await VerifyEmail.save();
        return res.status(201).json({success:true,message:"successfully assgined true foor drug inspector"});
    }
    catch(error){
        console.error('Error during fetching startups:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

exports.makeItRejected=catchAsyncErrors(async(req,res)=>{
    const { Email_ID }=req.body;
    try{
        const VerifyEmail=await Status.findOne({Email_ID:Email_ID});
        if(!VerifyEmail){
            return res.status(404).json({success:true,message:"Stratup not Found"});
        }
        VerifyEmail.isDrugInspectorRejected=true;
        await VerifyEmail.save();
        return res.status(201).json({success:true,message:"successfully assgined true foor drug inspector"});
    }
    catch(error){
        console.error('Error during fetching startups:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

exports.makeItLicensed=catchAsyncErrors(async(req,res)=>{
    const { Email_ID }=req.body;
    try{
        const VerifyEmail=await Status.findOne({Email_ID:Email_ID});
        if(!VerifyEmail){
            return res.status(404).json({success:true,message:"Stratup not Found"});
        }
        VerifyEmail.isLicensed=true;
        await VerifyEmail.save();
        return res.status(201).json({success:true,message:"successfully assgined true foor drug inspector"});
    }
    catch(error){
        console.error('Error during fetching startups:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

exports.makeItLARejected=catchAsyncErrors(async(req,res)=>{
    const { Email_ID }=req.body;
    try{
        const VerifyEmail=await Status.findOne({Email_ID:Email_ID});
        if(!VerifyEmail){
            return res.status(404).json({success:true,message:"Stratup not Found"});
        }
        VerifyEmail.ApplicationRejected=true;
        VerifyEmail.FilledApplication=false;
        await VerifyEmail.save();
        return res.status(201).json({success:true,message:"successfully assgined true foor drug inspector"});
    }
    catch(error){
        console.error('Error during fetching startups:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});