// routes/index.js

const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');
const listFilesController = require('../controllers/listFilesController');
const downloadFilesController = require('../controllers/downloadFileController');
const deleteFileController = require('../controllers/deleteFileController');
const awsPdfController = require('../controllers/awsPdfController');


const multer = require('multer');
const cors = require('cors');


router.use(cors());

const upload = multer({ dest: 'uploads/' });


router.get('/index', awsPdfController.indexAwsPdfs);
router.post('/upload', upload.single('pdf'), uploadController);
router.get('/files', listFilesController);
router.get('/download/:filename', downloadFilesController);
router.delete('/delete/:filename', deleteFileController);

module.exports = router;

