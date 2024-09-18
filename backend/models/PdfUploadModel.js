const mongoose=require("mongoose");

const pdfSchema=mongoose.Schema({
    Email_ID:String,
    pdf_address:String
});

module.exports=mongoose.model("pdfModel",pdfSchema);