const mongoose = require("mongoose");

//startup  model
 const DINotificationSchema = mongoose.Schema({
    DI_Email:{
        type:String,
        required:true
    },
    Startup_Email:String,
    Startup_Company:String,
    notification:String,
    date:String
});

module.exports = mongoose.model("DI_Notification",DINotificationSchema);