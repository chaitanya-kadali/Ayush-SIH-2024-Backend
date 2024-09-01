const mongoose=require('mongoose');

const drupInspectorSchema=mongoose.Schema({
    Email_ID:String,
    password:String
});

module.exports = mongoose.model("drupInspector",drupInspectorSchema);