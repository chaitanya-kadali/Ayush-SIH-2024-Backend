const mongoose=require('mongoose');

const drupInspectorSchema=mongoose.Schema({
    name:String,
    State:String,
    District:String,
    Email_ID:String,
    password:String,
    Notification:String
});

module.exports = mongoose.model("drupInspector",drupInspectorSchema);