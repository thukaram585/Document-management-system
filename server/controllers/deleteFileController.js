// controllers/deleteFileController.js

const s3Model = require('../models/s3');

module.exports = async (req, res) => {
  const filename = req.params.filename;

  try {
    await s3Model.deleteFile(filename);
    res.send('File deleted successfully.');
  } catch (err) {
    console.error('Failed to delete file:', err);
    res.status(500).send('Failed to delete file.');
  }
};
