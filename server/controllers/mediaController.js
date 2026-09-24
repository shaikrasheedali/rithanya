const path = require('path');
const fs = require('fs');
const prisma = require('../config/db');

/**
 * Get all media assets from the uploads directory and database
 */
async function getMediaAssets(req, res, next) {
  try {
    const uploadDir = path.join(__dirname, '../../client/public/assets/uploads');

    // Sync any existing files on disk into the MediaAsset database table
    if (fs.existsSync(uploadDir)) {
      const diskFiles = fs.readdirSync(uploadDir);
      for (const filename of diskFiles) {
        if (filename.startsWith('.') || filename === 'README.md') continue;
        try {
          const filePath = path.join(uploadDir, filename);
          const stat = fs.statSync(filePath);
          if (stat.isFile()) {
            const exists = await prisma.mediaAsset.findFirst({ where: { filename } });
            if (!exists) {
              const ext = path.extname(filename).toLowerCase();
              const mimeType = ext === '.png' ? 'image/png'
                : ext === '.svg' ? 'image/svg+xml'
                : ext === '.webp' ? 'image/webp'
                : ext === '.pdf' ? 'application/pdf'
                : 'image/jpeg';

              await prisma.mediaAsset.create({
                data: {
                  filename,
                  originalName: filename,
                  mimeType,
                  size: stat.size,
                  url: `/assets/uploads/${filename}`
                }
              });
            }
          }
        } catch (e) {
          // Continue syncing remaining files
        }
      }
    }

    const dbAssets = await prisma.mediaAsset.findMany({
      orderBy: { createdAt: 'desc' }
    });

    return res.json({
      success: true,
      data: {
        presets: [],
        uploaded: dbAssets
      },
      assets: dbAssets
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Handle multipart image/document upload to uploads directory
 */
async function uploadMedia(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const publicUrl = `/assets/uploads/${req.file.filename}`;

    const asset = await prisma.mediaAsset.create({
      data: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
        size: req.file.size,
        url: publicUrl
      }
    });

    return res.status(201).json({
      success: true,
      url: publicUrl,
      data: {
        ...asset,
        url: publicUrl
      }
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Delete a media asset from database and local disk
 */
async function deleteMedia(req, res, next) {
  try {
    const { id } = req.params;
    const asset = await prisma.mediaAsset.findUnique({ where: { id } });

    if (asset) {
      const uploadDir = path.join(__dirname, '../../client/public/assets/uploads');
      const filePath = path.join(uploadDir, asset.filename);
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch (e) {
          // File might already be gone
        }
      }
      await prisma.mediaAsset.delete({ where: { id } });
    }

    return res.json({ success: true, message: 'Asset deleted from storage' });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getMediaAssets,
  uploadMedia,
  deleteMedia
};
