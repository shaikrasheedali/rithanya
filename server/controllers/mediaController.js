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

              let fileDataBase64 = null;
              try {
                fileDataBase64 = fs.readFileSync(filePath).toString('base64');
              } catch (_) {}

              await prisma.mediaAsset.create({
                data: {
                  filename,
                  originalName: filename,
                  mimeType,
                  size: stat.size,
                  url: `/assets/uploads/${filename}`,
                  fileData: fileDataBase64
                }
              });
            } else if (exists && !exists.fileData) {
              try {
                const b64 = fs.readFileSync(filePath).toString('base64');
                await prisma.mediaAsset.update({
                  where: { id: exists.id },
                  data: { fileData: b64 }
                });
              } catch (_) {}
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
        const canonicalUrl = asset.url && (asset.url.startsWith('http') || asset.url.startsWith('/'))
          ? asset.url
          : `/assets/uploads/${asset.filename}`;

        uniqueAssets.push({
          ...asset,
          url: canonicalUrl,
          fileUrl: `/api/media/file/${asset.id}`
        });
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

    // Read file binary content as base64 for permanent cloud database storage
    let fileDataBase64 = null;
    try {
      if (fs.existsSync(uploadedFilePath)) {
        fileDataBase64 = fs.readFileSync(uploadedFilePath).toString('base64');
      }
    } catch (_) {}

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
            // Duplicate detected! If existing doesn't have fileData, save it now
            if (!candidate.fileData && fileDataBase64) {
              await prisma.mediaAsset.update({
                where: { id: candidate.id },
                data: { fileData: fileDataBase64 }
              }).catch(() => {});
            }

            // Remove the redundant temp file from disk
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
        url: publicUrl,
        fileData: fileDataBase64
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
      const distUploadDir = path.join(__dirname, '../../client/dist/assets/uploads');
      const filePath = path.join(uploadDir, asset.filename);
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch (e) {}
      }
      const distFilePath = path.join(distUploadDir, asset.filename);
      if (fs.existsSync(distFilePath)) {
        try {
          fs.unlinkSync(distFilePath);
        } catch (e) {}
      }
      await prisma.mediaAsset.delete({ where: { id } });
    }

    return res.json({ success: true, message: 'Asset deleted from storage' });
  } catch (err) {
    next(err);
  }
}

/**
 * Serve media file by ID or filename with auto-rehydration from MySQL fileData
 */
async function serveMediaFile(req, res, next) {
  try {
    const rawParam = req.params.idOrFilename || req.params.id || req.params.filename;
    if (!rawParam) {
      return res.status(400).json({ success: false, message: 'Missing file identifier' });
    }
    const cleanIdOrFilename = path.basename(rawParam);

    const uploadDir = path.join(__dirname, '../../client/public/assets/uploads');
    const distUploadDir = path.join(__dirname, '../../client/dist/assets/uploads');
    const fallbackImagePublic = path.join(__dirname, '../../client/public/image.png');
    const fallbackImageDist = path.join(__dirname, '../../client/dist/image.png');

    // 1. Check if physically exists on disk by filename
    const diskPath = path.join(uploadDir, cleanIdOrFilename);
    const distPath = path.join(distUploadDir, cleanIdOrFilename);

    if (fs.existsSync(diskPath)) {
      res.setHeader('Cache-Control', 'public, max-age=86400, stale-while-revalidate=604800');
      return res.sendFile(diskPath);
    }
    if (fs.existsSync(distPath)) {
      res.setHeader('Cache-Control', 'public, max-age=86400, stale-while-revalidate=604800');
      return res.sendFile(distPath);
    }

    // 2. Query database by ID or filename or URL
    const asset = await prisma.mediaAsset.findFirst({
      where: {
        OR: [
          { id: cleanIdOrFilename },
          { filename: cleanIdOrFilename },
          { url: { endsWith: cleanIdOrFilename } }
        ]
      }
    });

    if (asset) {
      // Check if disk has asset.filename
      if (asset.filename) {
        const namedDiskPath = path.join(uploadDir, asset.filename);
        if (fs.existsSync(namedDiskPath)) {
          res.setHeader('Cache-Control', 'public, max-age=86400, stale-while-revalidate=604800');
          return res.sendFile(namedDiskPath);
        }
      }

      // Rehydrate from fileData base64 if present
      if (asset.fileData && asset.fileData.trim().length > 20) {
        const buffer = Buffer.from(asset.fileData, 'base64');
        const filenameToWrite = asset.filename || cleanIdOrFilename;
        const rehydratePath = path.join(uploadDir, filenameToWrite);

        try {
          if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
          fs.writeFileSync(rehydratePath, buffer);
          if (fs.existsSync(distUploadDir)) {
            fs.writeFileSync(path.join(distUploadDir, filenameToWrite), buffer);
          }
        } catch (_) {}

        res.setHeader('Content-Type', asset.mimeType || 'image/jpeg');
        res.setHeader('Cache-Control', 'public, max-age=86400, stale-while-revalidate=604800');
        return res.status(200).send(buffer);
      }
    }

    // 3. Fallback to /image.png
    if (fs.existsSync(fallbackImagePublic)) {
      res.setHeader('Content-Type', 'image/png');
      res.setHeader('Cache-Control', 'public, max-age=86400');
      return res.status(200).sendFile(fallbackImagePublic);
    }
    if (fs.existsSync(fallbackImageDist)) {
      res.setHeader('Content-Type', 'image/png');
      res.setHeader('Cache-Control', 'public, max-age=86400');
      return res.status(200).sendFile(fallbackImageDist);
    }

    // 4. Hospital Branded SVG Fallback
    const cleanLabel = cleanIdOrFilename.replace(/[^a-zA-Z0-9._-]/g, '').slice(0, 30);
    const svgFallback = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="100%" height="100%">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f172a"/>
      <stop offset="50%" stop-color="#1e293b"/>
      <stop offset="100%" stop-color="#090d16"/>
    </linearGradient>
    <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#dc2626"/>
      <stop offset="100%" stop-color="#991b1b"/>
    </linearGradient>
  </defs>
  <rect width="600" height="400" fill="url(#bgGrad)"/>
  <rect x="20" y="20" width="560" height="360" rx="12" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="2" stroke-dasharray="6 6"/>
  <circle cx="300" cy="165" r="48" fill="url(#accentGrad)" opacity="0.9"/>
  <path d="M292 135 H308 V157 H330 V173 H308 V195 H292 V173 H270 V157 H292 Z" fill="#ffffff"/>
  <text x="300" y="245" fill="#f8fafc" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="20" font-weight="700" text-anchor="middle" letter-spacing="1">RITHANYA HOSPITAL</text>
  <text x="300" y="275" fill="#94a3b8" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="500" text-anchor="middle">Clinical Media Asset</text>
  <text x="300" y="305" fill="#64748b" font-family="monospace" font-size="11" text-anchor="middle">${cleanLabel}</text>
</svg>`;

    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    return res.status(200).send(svgFallback);
  } catch (err) {
    console.warn('[serveMediaFile] Catch handler:', err.message);
    const fallbackImagePublic = path.join(__dirname, '../../client/public/image.png');
    if (fs.existsSync(fallbackImagePublic)) {
      return res.status(200).sendFile(fallbackImagePublic);
    }
    return res.status(200).send('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect width="100%" height="100%" fill="#1e293b"/></svg>');
  }
}

module.exports = {
  getMediaAssets,
  uploadMedia,
  deleteMedia,
  serveMediaFile
};
