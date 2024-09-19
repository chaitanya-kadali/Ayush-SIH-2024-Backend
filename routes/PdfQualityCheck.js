const path = require('path');
const fs = require('fs');
const tesseract = require('tesseract.js');
const express = require('express');
const multer = require('multer');
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const pdfPoppler = require('pdf-poppler'); // Corrected import

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Function to convert PDF to Images
const convertPdfToImages = async (pdfBuffer, outputDir) => {
  const tempPdfPath = path.join(outputDir, 'temp.pdf'); // Create a temp PDF path
  try {
    fs.writeFileSync(tempPdfPath, pdfBuffer); // Write the buffer to the temp PDF file

    let opts = {
      format: 'png',
      out_dir: outputDir,
      out_prefix: 'page',
      page: null, // Convert all pages
    };

    // Use the correct `convert` function from pdf-poppler
    await pdfPoppler.convert(tempPdfPath, opts);
    console.log('PDF converted to images.');
    fs.unlinkSync(tempPdfPath); // Remove temp PDF file after conversion
  } catch (error) {
    console.error('Error converting PDF:', error);
    throw error;
  }
};

// Function to check image text clarity using Tesseract.js
const checkImageTextClarity = async (imagePath) => {
  try {
    const { data: { text, confidence } } = await tesseract.recognize(imagePath, 'eng', {
      logger: (m) => console.log(m),
    });

    console.log(`Extracted Text: ${text}`);
    console.log(`OCR Confidence: ${confidence}`);

    // Adjusted threshold for clarity check
    const isTextClear = confidence > 70; // Adjust threshold if needed
    return isTextClear;
  } catch (error) {
    console.error('Error processing image with Tesseract:', error);
    throw error;
  }
};

// Endpoint for PDF quality check
const PdfQualityCheck = catchAsyncErrors(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, error: 'No file uploaded' });
  }

  const outputDir = path.join(__dirname, 'images');

  try {
    // Ensure output directory exists
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir);
    }

    // Convert PDF buffer to images
    console.log('Converting PDF to images...');
    await convertPdfToImages(req.file.buffer, outputDir);

    // Check clarity of each image (page of PDF)
    const files = fs.readdirSync(outputDir);
    let allPagesClear = true;

    for (const file of files) {
      if (path.extname(file) === '.png') {
        const imagePath = path.join(outputDir, file);
        console.log(`Processing image: ${imagePath}`);

        // Check text clarity using OCR
        const isTextClear = await checkImageTextClarity(imagePath);
        if (!isTextClear) {
          console.log(`Text is unclear on page: ${file}`);
          allPagesClear = false;
          break;
        } else {
          console.log(`Text is clear on page: ${file}`);
        }
      }
    }

    if (allPagesClear) {
      res.status(200).json({ success: true, message: 'PDF is clear, proceed to upload.' });
    } else {
      res.status(400).json({ success: false, message: 'PDF is unclear, can\'t upload.' });
    }
  } catch (error) {
    console.error('Error processing PDF:', error);
    res.status(500).json({ success: false, message: 'Error processing PDF.', error: error.message });
  } finally {
    // Clean up generated images after processing
    cleanUpImages(outputDir);
  }
});

// Function to clean up generated images
const cleanUpImages = (imageDir) => {
  fs.readdir(imageDir, (err, files) => {
    if (err) {
      console.error('Error reading image directory:', err);
      return;
    }

    files.forEach((file) => {
      const filePath = path.join(imageDir, file);
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error(`Error deleting file ${filePath}:`, err);
        }
      });
    });
  });
};

const router = express.Router();

// pdf quality check route
router.route('/quality-check').post(upload.single('pdf'), PdfQualityCheck);

module.exports = router;
