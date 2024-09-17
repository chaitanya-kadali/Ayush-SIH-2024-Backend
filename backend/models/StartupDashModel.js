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
    feedback:String
});

module.exports=mongoose.model("StartupdashModel",StartupDashSchema);