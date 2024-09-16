const mongoose = require("mongoose");

//farmer model
 const Farmer = new mongoose.Schema({
      name:String,
      phone_number:Number,
      password:String,
      district:String,
      state:String,
      crop_name:String
  });

module.exports = mongoose.model("farmer",Farmer);