const mongoose = require("mongoose");

//user model

 const Farmer=mongoose.Schema({
      name:String,
      phone_number:Number,
      password:String,
      district:String,
      state:String,
      crop_name:String,
      language:String
  });

module.exports = mongoose.model("farmer",Farmer);