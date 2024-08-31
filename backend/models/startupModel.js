const mongoose = require("mongoose");

//startup  model
 const StartupModel = mongoose.Schema({
    companyName : String,
    address : String,
    city:String,
    pinCode:Number,
    state:String,
    district:String,
    PANno:Number,
    GSTno:Number,
    websiteAddress:String,
    certificateNo:Number,
    dateOfIssue:String,
    IssuuingAuthority:String,
    IE_code:Number
 })

module.exports = mongoose.model("startup",StartupModel);