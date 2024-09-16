const mongoose = require("mongoose");

 const Status = mongoose.Schema({
    Email_ID:String,  // startup s email
    FilledApplication : Boolean,
	FilledAplicationAccepted : Boolean, // (for frontend : if accepted is false the whole stuff should get RED from here to END.)
	isDrugInspectorAssigned: Boolean,
	isDrugInspectorAccepted : Boolean, // (for frontend : if accepted is false the whole stuff should get RED from here to end)
	isLicensed: Boolean,
  });

module.exports = mongoose.model("status",Status);