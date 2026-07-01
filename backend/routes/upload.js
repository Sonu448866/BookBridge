import express from 'express';
import multer from 'multer';
import { protect } from '../middleware/auth.js';
import { upload, uploadFile } from '../config/cloudinary.js';

const router = express.Router();

function handleMulterUpload(middleware) {
  return (req, res, next) => {
    middleware(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ message: err.code === 'LIMIT_FILE_SIZE' ? 'File too large (max 10MB)' : err.message });
      }
      if (err) return res.status(400).json({ message: err.message });
      next();
    });
  };
}

router.post('/image', protect, handleMulterUpload(upload.single('file')), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const result = await uploadFile(req.file, 'images');
    res.json({ url: result.url });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Upload failed' });
  }
});

router.post('/document', protect, handleMulterUpload(upload.single('file')), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const result = await uploadFile(req.file, 'docs');
    res.json({ url: result.url });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Upload failed' });
  }
});

router.post('/images', protect, handleMulterUpload(upload.array('files', 5)), async (req, res) => {
  try {
    if (!req.files?.length) return res.status(400).json({ message: 'No files uploaded' });

    const uploads = await Promise.all(
      req.files.map((f) => uploadFile(f, 'images'))
    );
    res.json({ urls: uploads.map((u) => u.url) });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Upload failed' });
  }
});

export default router;
