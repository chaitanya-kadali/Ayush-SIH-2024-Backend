const mongoose = require("mongoose");

//startup  model
 const LANotificationSchema = mongoose.Schema({
    LA_Email:{
        type:String,
        required:true
    },
    Startup_Email:String,
    Startup_Company:String,
    notification:String,
    date:String
});

module.exports = mongoose.model("LA_Notification",LANotificationSchema);