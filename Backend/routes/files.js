const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const FileUpload = require('../models/FileUpload');
const multer = require('multer');
const xlsx = require('xlsx');

// Configure multer for file upload
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
        file.mimetype === 'application/vnd.ms-excel' ||
        file.mimetype === 'text/csv') {
      cb(null, true);
    } else {
      cb(new Error('Only Excel and CSV files are allowed'), false);
    }
  }
});

// Upload file
router.post('/upload', auth, upload.single('excel'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(worksheet);

    if (data.length === 0) {
      return res.status(400).json({ message: 'File is empty or invalid' });
    }

    const columns = Object.keys(data[0]);

    const fileUpload = new FileUpload({
      userId: req.user.id,
      originalFileName: req.file.originalname,
      fileSize: req.file.size,
      data: data,
      columns: columns,
      status: 'completed'
    });

    await fileUpload.save();

    res.status(201).json({
      message: 'File uploaded successfully',
      file: {
        _id: fileUpload._id,
        originalFileName: fileUpload.originalFileName,
        fileSize: fileUpload.fileSize,
        uploadDate: fileUpload.uploadDate,
        status: fileUpload.status,
        columns: fileUpload.columns,
        rowCount: fileUpload.data.length
      }
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Error uploading file' });
  }
});

// Get user files
router.get('/', auth, async (req, res) => {
  try {
    const files = await FileUpload.find({ userId: req.user.id })
      .select('originalFileName fileSize uploadDate status columns data')
      .sort({ uploadDate: -1 });

    const formattedFiles = files.map(file => ({
      _id: file._id,
      originalFileName: file.originalFileName,
      fileSize: file.fileSize,
      uploadDate: file.uploadDate,
      status: file.status,
      columns: file.columns,
      rowCount: file.data.length
    }));

    res.json(formattedFiles);
  } catch (error) {
    console.error('Error fetching files:', error);
    res.status(500).json({ message: 'Error fetching files' });
  }
});

// Get specific file data
router.get('/:fileId', auth, async (req, res) => {
  try {
    const file = await FileUpload.findOne({
      _id: req.params.fileId,
      userId: req.user.id
    });

    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    res.json({
      _id: file._id,
      originalFileName: file.originalFileName,
      fileSize: file.fileSize,
      uploadDate: file.uploadDate,
      status: file.status,
      columns: file.columns,
      data: file.data,
      rowCount: file.data.length
    });
  } catch (error) {
    console.error('Error fetching file data:', error);
    res.status(500).json({ message: 'Error fetching file data' });
  }
});

module.exports = router; 