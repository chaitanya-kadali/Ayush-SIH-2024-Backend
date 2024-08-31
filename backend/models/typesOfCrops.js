const mongoose=require('mongoose');

const CropSchema=mongoose.Schema({
    crop_name:String
});

module.exports = mongoose.model("cropname",CropSchema);
