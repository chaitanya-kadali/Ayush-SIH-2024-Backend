const mongoose=require('mongoose');

const LiscensingAuthoritySchema=mongoose.Schema({
    name:String,
    Email_ID:String,
    password:String,
    mobile_no:Number,
    designation:String,
    Qualification:String,
    OrderReferenceNo:String,
    OrderDate:String,
    State:String,
    district:String,
    
});

module.exports = mongoose.model("LiscensingAuthority",LiscensingAuthoritySchema);