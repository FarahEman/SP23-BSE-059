const express = require('express');
const router = express.Router();
const cloudinary = require('../../cloudinary');
const multer = require('multer');

// Configure multer for memory storage (file buffer in memory)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Middleware to set `activeLink` dynamically
router.use((req, res, next) => {
  res.locals.activeLink = req.path; // Automatically sets the active link based on the URL
  next();
});

// Render file upload form
router.get('/test', (req, res) => {
  res.render('test', { layout: 'layouts/layout', activeLink: '/test' });
});

// Handle file upload and upload to Cloudinary
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send('No file uploaded.');
    }

    // Upload the file to Cloudinary
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: 'auto' }, // Automatically detect file type
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(req.file.buffer); // Send file buffer to Cloudinary
    });

    // Respond with the uploaded file's URL
    res.send(
      `File uploaded successfully! View it <a href="${result.secure_url}" target="_blank">here</a>.`
    );
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).send('An error occurred while uploading the file.');
  }
});

module.exports = router;
