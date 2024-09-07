const mongoose=require('mongoose');

const drupInspectorSchema=mongoose.Schema({
    name:String,
    Email_ID:String,
    password:String,
    State:String,
    district:String,
    Notification:String
});

module.exports = mongoose.model("drupInspector",drupInspectorSchema);