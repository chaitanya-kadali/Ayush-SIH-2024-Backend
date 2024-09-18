const mongoose = require('mongoose');
const multer = require('multer');
const GridFSBucket = require('mongodb').GridFSBucket;
const catchAsyncErrors = require("../middleware/catchAsyncErrors");

const PdfUploadModel = require('../models/PdfUploadModel');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Uploading the PDF
exports.uploadPdf = catchAsyncErrors(async (req, res) => {
    const uploadMiddleware = upload.single('pdf');
  
    // Invoke the multer middleware manually
    uploadMiddleware(req, res, async (err) => {
        if (err) {
            return res.status(500).send(err.message);
        }
        if (!req.file) {
            return res.status(400).send('No file uploaded.');
        }

        const { Email_ID } = req.body;

        try {
            const db = mongoose.connection.db;
            const bucket = new GridFSBucket(db);
            const pdfBuffer = req.file.buffer;
            const uploadStream = bucket.openUploadStream(req.file.originalname, {
                metadata: { Email_ID }
            });
  
            // Store the PDF in GridFS
            uploadStream.end(pdfBuffer);
  
            uploadStream.on('finish', async () => {
                const fileId = uploadStream.id; // Get the file ID (for MongoDB GridFS)
                // Update the user's document with the PDF file ID
                const newPdfModel=new PdfUploadModel({
                    Email_ID:Email_ID,
                    pdf_address:req.file.originalname
                });

                await newPdfModel.save();
  
                res.status(200).json({success:true, message: 'PDF uploaded and linked successfully.', fileDetails:newPdfModel});
            });
  
            uploadStream.on('error', (err) => {
                res.status(500).send('Error uploading PDF: ' + err.message);
            });
  
        } catch (error) {
            console.error('Error:', error);
            res.status(400).json({ error: error.message, success: false });
        }
    });
});

// Function to get the PDF based on Email_ID from metadata
exports.getPdf = catchAsyncErrors(async (req, res) => {
    try {
        const { Email_ID } = req.body; // The email of the user (startup, doctor, etc.)
        const db = mongoose.connection.db;
        const bucket = new GridFSBucket(db);

        // Find the file in the fs.files collection using the Email_ID in metadata
        const file = await db.collection('fs.files').findOne({ 'metadata.Email_ID': Email_ID });

        if (!file) {
            return res.status(404).json({ message: 'File not found for this Email ID' });
        }

        // Set the headers for file download
        res.set({
            'Content-Type': file.contentType || 'application/pdf',
            'Content-Disposition': `attachment; filename="${file.filename}"`,
        });
        // Create a download stream from GridFSBucket
        const downloadStream = bucket.openDownloadStream(file._id);

        // Pipe the file to the response
        downloadStream.pipe(res);

        // Handle errors while downloading
        downloadStream.on('error', (err) => {
            console.error('Error downloading file:', err);
            res.status(500).send('Error downloading file.');
        });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error retrieving file' });
    }
});


