const mongoose=require('mongoose');

const drupInspectorSchema=mongoose.Schema({
    name:String,
    Email_ID:String,
    password:String,
    mobile_no:Number,
    designation:String,
    Qualification:String,
    OrderReferenceNo:Number,
    OrderDate:String,
    OrderPdfCopy:{
        type:String,
        required:true
    },
    State:String,
    district:String,
    Notification:String
});

module.exports = mongoose.model("drupInspector",drupInspectorSchema);