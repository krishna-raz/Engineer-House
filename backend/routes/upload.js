const express = require('express');
const upload = require('../middleware/multer');
const { authMiddleware, adminOnly } = require('../middleware/auth');

const router = express.Router();

// Upload image (admin only)
router.post('/', authMiddleware, adminOnly, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const filePath = `/uploads/${req.file.filename}`;
  res.json({ message: 'Image uploaded successfully', filePath, filename: req.file.filename });
});

module.exports = router;
