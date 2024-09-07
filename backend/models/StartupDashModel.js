const mongoose=require('mongoose');

const StartupDashSchema=mongoose.Schema({

    PANno:String,
    GSTno:String,
    websiteAddress:String,
    certificateNo:Number,
    CompanyDOI:String,
    IssuuingAuthority:String,
    IE_code:Number,
    IE_DOI:String,
    pdf1:{
        type:String,
        required:true
    },
    pdf2:{
        type:String,
        required:true
    }
})

module.exports=mongoose.model("StartupdashModel",StartupDashSchema);