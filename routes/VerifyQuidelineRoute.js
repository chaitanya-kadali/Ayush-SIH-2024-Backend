const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const moment = require('moment');
const pdf = require('pdf-poppler');
const Tesseract = require('tesseract.js');
const catchAsyncErrors=require("../middleware/catchAsyncErrors");

const app = express();

// Set up Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Function to convert PDF pages to images
const convertPdfToImages = async (pdfPath, outputDir) => {
  const opts = {
    format: 'png',
    out_dir: outputDir,
    out_prefix: 'page'
  };

  try {
    await pdf.convert(pdfPath, opts);
    console.log('PDF converted to images.');
  } catch (error) {
    console.error('Error converting PDF:', error);
    throw error;
  }
};

// Function to extract text from image using Tesseract.js
const extractTextFromImage = async (imagePath) => {
  try {
    const { data: { text } } = await Tesseract.recognize(imagePath, 'eng', {
      logger: info => console.log(info)
    });
    return text;
  } catch (error) {
    console.error('Error processing image with Tesseract:', error);
    throw error;
  }
};

// Function to extract date from text
const extractDateFromText = (text) => {
  const dateRegex = /\b(\d{4}-\d{2}-\d{2})\b/; // Assuming date format YYYY-MM-DD
  const match = text.match(dateRegex);
  return match ? match[0] : null;
};

// Endpoint to check PDF date
const VerifyQuideline = catchAsyncErrors( async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }

  const pdfPath = req.file.path;
  const outputDir = path.join(__dirname, 'images');

  try {
    // Ensure output directory exists
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir);
    }

    // Convert PDF pages to images
    console.log('Converting PDF to images...');
    await convertPdfToImages(pdfPath, outputDir);

    // Check clarity of each image (page of PDF)
    const files = fs.readdirSync(outputDir);
    let allPagesClear = true;

    for (const file of files) {
      if (path.extname(file) === '.png') {
        const imagePath = path.join(outputDir, file);
        console.log(`Processing image: ${imagePath}`);

        // Extract text from image
        const text = await extractTextFromImage(imagePath);
        console.log(`Extracted Text: ${text}`);

        // Extract date from text
        const issueDateStr = extractDateFromText(text);
        if (!issueDateStr) {
          console.log('Issue date not found in image');
          allPagesClear = false;
          break;
        }

        const issueDate = moment(issueDateStr, 'YYYY-MM-DD');
        const now = moment();
        const twoMonthsAgo = now.subtract(2, 'months');

        if (issueDate.isBefore(twoMonthsAgo)) {
          console.log('PDF issue date is more than two months old');
          allPagesClear = false;
          break;
        }
      }
    }

    if (allPagesClear) {
      res.status(200).json({ success: true, message: 'PDF verified. Date is within the last two months.' });
    } else {
      res.status(400).json({ success: false, message: 'PDF issue date is more than two months old or date not found.' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: error.message });
  } finally {
    // Clean up uploaded file and generated images
    fs.unlinkSync(pdfPath);
    fs.readdir(outputDir, (err, files) => {
      if (err) {
        console.error('Error reading image directory:', err);
        return;
      }

      files.forEach(file => {
        const filePath = path.join(outputDir, file);
        fs.unlink(filePath, err => {
          if (err) {
            console.error(`Error deleting file ${filePath}:`, err);
          }
        });
      });
    });
  }
})


// Ensure the uploads directory exists
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}


const router = express.Router();

// checking the pdf following the guide line rules
router.route('/guideline-check').post(upload.single('pdf'), VerifyQuideline);

module.exports = router;
