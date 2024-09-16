const Status = require("../models/applicationStatus");
const LA_Notification=require("../models/LA_Notification");
const catchAsyncErrors = require("../middleware/catchAsyncErrors"); // by default error catcher


// --/isDrugInspectorAssigned-false

exports.isNotAssigned = catchAsyncErrors( async (req,res) => {    // return {success , pendingList}
    // GET function
    console.log("called");
    try{
        console.log("called");
        const statusList = await Status.find({ isDrugInspectorAssigned: false });
        res.status(200).json({ success: true,pendingList:statusList, message: 'Startup Details for farmer'});
    } catch (error) {
        console.error('Error during fetching startups:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});
//  ---  /isDrugInspectorAssigned-true

exports.isAssigned = catchAsyncErrors( async (req,res) => {    // return {success , pendingList}
    // GET function
    console.log("called not 24");
    try{

        const statusList = await Status.find({ isDrugInspectorAssigned: true });
        res.status(200).json({ success: true,assignedList:statusList, message: 'Startup Details for farmer'});
    } catch (error) {
        console.error('Error during fetching startups:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

// isDrugInspectorAccepted-true
exports.isAccepted = catchAsyncErrors( async (req,res) => {    // return {success , pendingList}
    // GET function
    console.log("called not 24");
    try{

        const statusList = await Status.find({ isDrugInspectorAccepted: true });
        res.status(200).json({ success: true,acceptedList:statusList, message: 'Startup Details for farmer'});
    } catch (error) {
        console.error('Error during fetching startups:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

// isDrugInspectorAccepted-false
exports.isNotAccepted = catchAsyncErrors( async (req,res) => {    // return {success , pendingList}
    // GET function
    console.log("called not 24");
    try{

        const statusList = await Status.find({ isDrugInspectorAccepted: false });
        res.status(200).json({ success: true,rejectedList:statusList, message: 'Startup Details for farmer'});
    } catch (error) {
        console.error('Error during fetching startups:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});
// isLicensed-true
exports.isLicensed = catchAsyncErrors( async (req,res) => {    // return {success , pendingList}
    // GET function
    console.log("called not 24");
    try{

        const statusList = await Status.find({ isLicensed: true });
        res.status(200).json({ success: true,licensedList:statusList, message: 'Startup Details for farmer'});
    } catch (error) {
        console.error('Error during fetching startups:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

exports.isNotifyEligible = catchAsyncErrors(async (req, res) => {
    const { Startup_Email } = req.body;
    try {
        const Startup_Exist = await LA_Notification.findOne({ Startup_Email:Startup_Email });
        if (!Startup_Exist) {
            return res.status(201).json({ success: true });
        }
        
        const storedDate = Startup_Exist.date; // Ensure date is a Date object

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



