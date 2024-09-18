const mongoose = require("mongoose");

//farmer model
 const Doctor = mongoose.Schema({
      name:String,
      Email_ID:String,
      password:String,
      district:String,
      state:String,
      phone_number:Number,
      pdf:{
        type:String
      }

  });

module.exports = mongoose.model("doctor",Doctor);