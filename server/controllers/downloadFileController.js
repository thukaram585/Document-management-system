// controllers/downloadFileController.js

const s3Model = require('../models/s3');

module.exports = async (req, res) => {
  const filename = req.params.filename;

  try {
    const fileData = await s3Model.downloadFile(filename);
    res.attachment(filename); // Set filename in response header
    res.send(fileData);
  } catch (err) {
    console.error('Failed to download file:', err);
    res.status(500).send('Failed to download file.');
  }
};
