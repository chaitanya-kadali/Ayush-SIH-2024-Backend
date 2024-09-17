const mongoose=require('mongoose');

const StartupDashSchema=mongoose.Schema({
    Email:String,
    PANno:String,
    GSTno:String,
    websiteAddress:String,
    certificateNo:Number,
    CompanyDOI:String,
    IssuuingAuthority:String,
    IE_code:Number,
    IE_DOI:String,
    feedback:{
        type: [String],  // Ensure that this is an array of strings
        default: [],
      }
});

module.exports=mongoose.model("StartupdashModel",StartupDashSchema);