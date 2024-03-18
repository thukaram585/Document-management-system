// controllers/uploadController.js

const s3Model = require('../models/s3');
const fs = require('fs');

module.exports = async (req, res) => {
  const file = req.file;
  if (!file) {
    return res.status(400).send('No file uploaded.');
  }

  try {
    // Read the content of the file
    const fileContent = fs.readFileSync(file.path, 'utf-8');

    // Construct the JSON object with file content
    const jsonData = {
      content: fileContent
    };

    // Upload the file to S3
    const uploadResult = await s3Model.uploadFile(file, file.originalname);
    if (uploadResult) {
      fs.unlinkSync(file.path); // Remove the file from local storage after upload
      res.status(200).send('File uploaded successfully.');
    } else {
      res.status(500).send('Failed to upload file to S3.');
    }
  } catch (error) {
    console.error('Error processing file:', error);
    res.status(500).send('Error processing file.');
  }
};
