const { application } = require("express");
const mongoose = require("mongoose");

 const Status = mongoose.Schema({
    Email_ID:String,  // startup s email
    FilledApplication : Boolean,
	AplicationAccepted : Boolean, // (for frontend : if accepted is false the whole stuff should get RED from here to END.)
	ApplicationRejected :Boolean, // if accepted is true then rejected is 100% gonna become false(as it is being initiated with the false value it will be untouched as the drug insp is already pressed accept)
										// VICE VERSA	
	isDrugInspectorAssigned: Boolean,
	isDrugInspectorAccepted : Boolean, // (for frontend : if accepted is false the whole stuff should get RED from here to end)
	isDrugInspectorRejected : Boolean,
	isLicensed: Boolean,
  });

module.exports = mongoose.model("status",Status);