const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const prisma = require('../config/db');

function computeFileHash(filePath) {
  try {
    const fileBuffer = fs.readFileSync(filePath);
    return crypto.createHash('sha256').update(fileBuffer).digest('hex');
  } catch (e) {
    return null;
  }
}

/**
 * Get all media assets from the uploads directory and database
 */
async function getMediaAssets(req, res, next) {
  try {
    const uploadDir = path.join(__dirname, '../../client/public/assets/uploads');
    const distUploadDir = path.join(__dirname, '../../client/dist/assets/uploads');

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
              const isVideo = /^\.(mp4|webm|ogg|mov|m4v|mkv)$/i.test(ext);
              const mimeType = isVideo ? `video/${ext.replace('.', '')}`
                : ext === '.png' ? 'image/png'
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

            // Sync to dist uploads if directory exists
            if (fs.existsSync(distUploadDir)) {
              const distFilePath = path.join(distUploadDir, filename);
              if (!fs.existsSync(distFilePath)) {
                try {
                  fs.copyFileSync(filePath, distFilePath);
                } catch (e) {}
              }
            }
          }
        } catch (e) {
          // Continue syncing remaining files
        }
      }
    }

    const { search, type } = req.query;
    let where = {};

    if (search && search.trim()) {
      where.OR = [
        { originalName: { contains: search.trim() } },
        { filename: { contains: search.trim() } }
      ];
    }

    if (type === 'IMAGE') {
      where.mimeType = { startsWith: 'image/' };
    } else if (type === 'VIDEO') {
      where.mimeType = { startsWith: 'video/' };
    }

    const dbAssets = await prisma.mediaAsset.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });

    // Deduplicate any redundant records by filename/url
    const seen = new Set();
    const uniqueAssets = [];
    const duplicateIds = [];

    for (const asset of dbAssets) {
      const key = `${asset.filename}_${asset.size}`;
      if (seen.has(key)) {
        duplicateIds.push(asset.id);
      } else {
        seen.add(key);
        uniqueAssets.push(asset);
      }
    }

    // Clean up duplicate DB rows in background
    if (duplicateIds.length > 0) {
      prisma.mediaAsset.deleteMany({ where: { id: { in: duplicateIds } } }).catch(() => {});
    }

    return res.json({
      success: true,
      data: {
        presets: [],
        uploaded: uniqueAssets
      },
      assets: uniqueAssets
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Handle multipart image/document upload to uploads directory with SHA-256 duplicate detection
 */
async function uploadMedia(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const uploadDir = path.join(__dirname, '../../client/public/assets/uploads');
    const distUploadDir = path.join(__dirname, '../../client/dist/assets/uploads');
    const uploadedFilePath = req.file.path;
    const uploadedHash = computeFileHash(uploadedFilePath);

    // 1. Check for duplicate asset by file size and SHA-256 hash
    if (uploadedHash) {
      const candidates = await prisma.mediaAsset.findMany({
        where: { size: req.file.size }
      });

      for (const candidate of candidates) {
        const candidatePath = path.join(uploadDir, candidate.filename);
        if (fs.existsSync(candidatePath)) {
          const candidateHash = computeFileHash(candidatePath);
          if (candidateHash && candidateHash === uploadedHash) {
            // Duplicate detected! Remove the new duplicate file from disk
            try {
              if (fs.existsSync(uploadedFilePath)) {
                fs.unlinkSync(uploadedFilePath);
              }
            } catch (e) {}

            return res.status(200).json({
              success: true,
              isDuplicate: true,
              message: 'Identical media asset already exists in storage. Reused existing asset.',
              url: candidate.url,
              data: candidate
            });
          }
        }
      }
    }

    // 2. New unique asset
    const publicUrl = `/assets/uploads/${req.file.filename}`;

    // Mirror to client/dist/assets/uploads if it exists
    if (fs.existsSync(distUploadDir)) {
      try {
        fs.copyFileSync(uploadedFilePath, path.join(distUploadDir, req.file.filename));
      } catch (e) {}
    }

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
      isDuplicate: false,
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
