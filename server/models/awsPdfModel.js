// awsPdfModel.js

// Import necessary modules
const { S3 } = require('aws-sdk');
const { Client } = require('@elastic/elasticsearch');
const pdf = require('pdf-parse');
const path = require('path');
const mammoth = require('mammoth');
const fs = require('fs');

// Create an Elasticsearch client
const es = new Client({ node: 'http://localhost:9200', auth: { username: 'elastic', password: 'soxEtLxdpFN3U6TOi_US' } });

// Create an S3 client
const s3 = new S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

// Function to retrieve PDF files from AWS S3 bucket
async function retrieveFileFromS3(bucket, key) {
    try {
        const params = { Bucket: bucket, Key: key };
        const data = await s3.getObject(params).promise();
        return data.Body;
    } catch (error) {
        console.error('Failed to retrieve PDF file from S3:', error);
        return null;
    }
}


const supportedExtensions = ['.pdf', '.txt', '.jpeg', '.jpg', '.png', '.doc', '.docx', '.rtf', '.cfg', '.conf', '.ini', '.sql', '.csv', '.numbers', '.ods','.xml', '.xls', '.xlsx', '.odt', '.pages', '.wpd', '.wps', '.c', '.cpp', '.cs', '.java', '.js', '.py', '.html','.css', '.swift', '.vb','.jar', '.pdfxml', '.afpub', '.indd', '.pmd', '.pub', '.qxp', '.json', '.bmp', '.gif', '.ico', '.raw', '.tif', '.tiff'];

async function processS3Bucket(bucketName, indexName) {
    try {
        const { Contents: files } = await s3.listObjectsV2({ Bucket: bucketName }).promise();
        for (const file of files) {
            const fileName = file.Key;
            const fileExtension = path.extname(fileName).toLowerCase();
            if (supportedExtensions.includes(fileExtension)) {
                const fileData = await retrieveFileFromS3(bucketName, fileName);
                if (fileData) {
                    // Check if the document already exists in Elasticsearch
                    const { body: documentExists } = await es.exists({ index: indexName, id: fileName });
                    if (!documentExists) {
                        let content;
                        if (fileExtension === '.pdf') {
                            content = (await pdf(fileData)).text.substring(0, 1000000);
                        } else if (fileExtension === '.doc' || fileExtension === '.docx') {
                            content = (await mammoth.extractRawText({ buffer: fileData })).value.substring(0, 1000000);
                        } else {
                            content = fileData.toString('utf-8').substring(0, 1000000);
                        }
                        // Index the document into Elasticsearch
                        await es.index({ index: indexName, id: fileName, body: { filename: fileName, content } });
                        console.log(`Indexed file ${fileName}`);
                    } else {
                        console.log(`File ${fileName} already indexed`);
                    }
                }
            } else {
                console.log(`Skipping file ${fileName} with unsupported extension`);
            }
        }
        console.log('Indexing complete.');
    } catch (error) {
        console.error('Failed to process and index files from S3:', error);
    }
}

// Function to delete PDF documents from Elasticsearch based on their filenames
async function deletePdfFromElasticsearch(indexName, filename) {
    try {
        const { body: result } = await es.deleteByQuery({
            index: indexName,
            body: {
                query: {
                    match: {
                        filename: filename
                    }
                }
            }
        });
        console.log(`Deleted document(s) with filename: ${filename}`);
    } catch (error) {
        console.error('Failed to delete PDF documents from Elasticsearch:', error);
    }
}


// Export the processS3Bucket and deletePdfFromElasticsearch functions
module.exports = { processS3Bucket, deletePdfFromElasticsearch };