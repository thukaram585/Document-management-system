// controllers/listFilesController.js

const s3Model = require('../models/s3');

module.exports = async (req, res) => {
  const files = await s3Model.listFiles();
  res.status(200).json(files);
};
