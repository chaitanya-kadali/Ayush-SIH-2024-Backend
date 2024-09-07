const mongoose = require("mongoose");

//farmer model
 const Doctor = mongoose.Schema({
      name:String,
      Email_ID:String,
      password:String,
      district:String,
      state:String,
      phone_number:Number,
<<<<<<< HEAD
      language:String,
      pdf:{
        type:String,
        required:true
      }
=======
  // no need of language
>>>>>>> b8a758f9e4d6981efdc070235fc7320caf51f791
  });

module.exports = mongoose.model("doctor",Doctor);