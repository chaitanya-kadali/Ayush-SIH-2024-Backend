const { GridFSBucket } = require('mongodb');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const pdf = require('pdf-poppler');
const tesseract = require('tesseract.js');
const Pdf = require('./models/pdfModel'); // Import the Pdf model
const upload = require('./uploadMiddleware'); // Ensure this path is correct

// Function to convert PDF to Images
const convertPdfToImages = async (pdfPath, outputDir) => {
  let opts = {
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

// Function to check image text clarity using Tesseract.js
const checkImageTextClarity = async (imagePath) => {
  try {
    const { data: { text, confidence } } = await tesseract.recognize(imagePath, 'eng', {
      logger: (m) => console.log(m)
    });

    console.log(`Extracted Text: ${text}`);
    console.log(`OCR Confidence: ${confidence}`);

    // Adjusted threshold for clarity check
    const isTextClear = confidence > 70; // Adjusted threshold
    return isTextClear;
  } catch (error) {
    console.error('Error processing image with Tesseract:', error);
    throw error;
  }
};

// Endpoint for PDF quality check
exports.PdfQualityCheck = catchAsyncErrors(async (req, res) => {
  const uploadMiddleware = upload.single('pdf');

  // Invoke the multer middleware manually
  uploadMiddleware(req, res, async (err) => {
    if (err) {
      return res.status(500).send(err.message);
    }
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No file uploaded' });
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
        // Throw an error if any page is unclear
        fs.unlinkSync(pdfPath); // Remove uploaded PDF
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
router.route('/pdfQualityCheck').post(asyncMiddleware(PdfQualityCheck)); 

module.exports = router;