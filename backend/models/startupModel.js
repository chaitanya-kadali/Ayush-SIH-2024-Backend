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
    district:String
 })

module.exports = mongoose.model("startup",Startup);