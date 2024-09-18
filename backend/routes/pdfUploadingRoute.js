const express = require("express");
const router = express.Router();

const authenticateJWT=require("../middleware/authMiddleware");  //validate the Token after login

const{
    uploadPdf,
    getPdf
}=require("../controllers/pdfController");

// uploading the pdf
router.route("/upload-pdf").post(uploadPdf);

// ge the pdf route
router.route("/get-pdf").post(getPdf); 

module.exports = router;