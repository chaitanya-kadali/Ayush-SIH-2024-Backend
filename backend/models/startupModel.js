const mongoose = require("mongoose");

//startup  model
 const Startup = mongoose.Schema({
   Email_ID:String,
   password:String,
    companyName : String,
    address : String,
    city:String,
    pinCode:Number,
    state:String,
    district:String,
    PANno:String,
    GSTno:String,
    websiteAddress:String,
    certificateNo:Number,
    dateOfIssue:String,
    IssuuingAuthority:String,
    IE_code:Number
 })

module.exports = mongoose.model("startup",Startup);