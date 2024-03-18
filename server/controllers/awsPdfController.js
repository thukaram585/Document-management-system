// Import the processS3Bucket function
const { processS3Bucket } = require('../models/awsPdfModel');

// Define the indexAwsPdfs controller function
const indexAwsPdfs = async (req, res) => {
    try {
        // Provide the bucketName and indexName when calling processS3Bucket function
        await processS3Bucket(process.env.S3_BUCKET, 'aws_data');
        res.status(200).json({ message: 'Indexing complete.' });
    } catch (error) {
        console.error('Failed to process and index PDF files:', error);
        res.status(500).json({ error: 'Failed to process and index PDF files' });
    }
};

// Export the indexAwsPdfs controller function
module.exports = { indexAwsPdfs };
