const Status = require("../models/applicationStatus");
const catchAsyncErrors = require("../middleware/catchAsyncErrors"); // by default error catcher


// --/isDrugInspectorAssigned-false

exports.isAssigned = catchAsyncErrors( async (req, res) => {    // return {success , pendingList}
    // GET function
    try{
        const statusList = await Status.find({ isDrugInspectorAssigned: false });
        res.status(200).json({ success: true,pendingList:statusList, message: 'Startup Details for farmer'});
    } catch (error) {
        console.error('Error during fetching startups:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});


