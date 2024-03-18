// models/s3.js

const { S3Client, PutObjectCommand, ListObjectsCommand , GetObjectCommand , DeleteObjectCommand} = require("@aws-sdk/client-s3");
const { deletePdfFromElasticsearch } = require('./awsPdfModel')
const dotenv = require('dotenv');
dotenv.config();
const fs = require('fs');


const s3Client = new S3Client({
  region: process.env.S3_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  }
});

module.exports = {
  uploadFile: async (file, originalname) => {
    const fileStream = fs.createReadStream(file.path);

    const uploadParams = {
      Bucket: process.env.S3_BUCKET,
      Key: originalname,
      Body: fileStream,
    };

    try {
      const uploadCommand = new PutObjectCommand(uploadParams);
      const data = await s3Client.send(uploadCommand);
      console.log('File uploaded successfully:', data);
      return true;
    } catch (err) {
      console.error('Failed to upload file to S3:', err);
      return false;
    }
  },

  listFiles: async () => {
    try {
      const listParams = {
        Bucket: process.env.S3_BUCKET,
      };

      const listCommand = new ListObjectsCommand(listParams);
      const data = await s3Client.send(listCommand);
      
      return data.Contents.map(object => object.Key);
    } catch (err) {
      console.error('Failed to list files in S3 bucket:', err);
      return [];
    }
  },

  downloadFile: async (filename) => {
    const downloadParams = {
      Bucket: process.env.S3_BUCKET,
      Key: filename
    };

    try {
      const data = await s3Client.send(new GetObjectCommand(downloadParams));
      return data.Body;
    } catch (err) {
      console.error('Failed to download file:', err);
      throw new Error('Failed to download file from S3.');
    }
  },

  deleteFile: async (filename) => {
    const deleteParams = {
        Bucket: process.env.S3_BUCKET,
        Key: filename
    };

    try {
        // Delete file from AWS S3
        await s3Client.send(new DeleteObjectCommand(deleteParams));

        // Delete document from Elasticsearch
        await deletePdfFromElasticsearch('aws_data', filename); // Replace 'your_index_name' with the actual index name
        console.log(`Deleted file ${filename} from S3 and Elasticsearch`);
    } catch (err) {
        console.error('Failed to delete file:', err);
        throw new Error('Failed to delete file from S3.');
    }
},


};
