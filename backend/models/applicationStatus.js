const { application } = require("express");
const mongoose = require("mongoose");

 const Status = mongoose.Schema({
    Email_ID:String,  // startup s email
    FilledApplication : Boolean,
	AplicationAccepted : Boolean, // (for frontend : if accepted is false the whole stuff should get RED from here to END.)
	ApplicationRejected :Boolean,
	isDrugInspectorAssigned: Boolean,
	isDrugInspectorAccepted : Boolean, // (for frontend : if accepted is false the whole stuff should get RED from here to end)
	isDrugInspectorRejected : Boolean,
	isLicensed: Boolean,
  });

module.exports = mongoose.model("status",Status);