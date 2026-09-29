const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const sharp = require('sharp');
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
 * Synchronize any unindexed physical files on disk into the MediaAsset database table
 * Executed during startup or via explicit admin sync trigger
 */
async function syncDiskAssetsToDatabase() {
  const uploadDir = path.join(__dirname, '../../client/public/assets/uploads');
  const distUploadDir = path.join(__dirname, '../../client/dist/assets/uploads');

  if (!fs.existsSync(uploadDir)) return { syncedCount: 0 };
  const diskFiles = fs.readdirSync(uploadDir);
  let syncedCount = 0;

  for (const filename of diskFiles) {
    if (filename.startsWith('.') || filename === 'README.md') continue;
    try {
      const filePath = path.join(uploadDir, filename);
      const stat = fs.statSync(filePath);
      if (stat.isFile()) {
        const exists = await prisma.mediaAsset.findFirst({
          where: { filename },
          select: { id: true, fileData: true }
        });

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
            // Keep memory safe: only load base64 if under 15MB
            if (stat.size < 15 * 1024 * 1024) {
              fileDataBase64 = fs.readFileSync(filePath).toString('base64');
            }
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
          syncedCount++;
        } else if (exists && !exists.fileData && stat.size < 15 * 1024 * 1024) {
          try {
            const b64 = fs.readFileSync(filePath).toString('base64');
            await prisma.mediaAsset.update({
              where: { id: exists.id },
              data: { fileData: b64 }
            });
          } catch (_) {}
        }

        // Mirror to dist uploads if directory exists
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

  return { syncedCount };
}

/**
 * Admin manual sync endpoint for media assets
 */
async function syncMediaEndpoint(req, res, next) {
  try {
    const result = await syncDiskAssetsToDatabase();
    return res.json({
      success: true,
      message: `Media assets synchronized successfully (${result.syncedCount} newly indexed)`,
      ...result
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Get all media assets from database with lean metadata (strictly excluding fileData longblob)
 * Fast, responsive, sub-15ms response time
 */
async function getMediaAssets(req, res, next) {
  try {
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

    // High performance query: EXCLUDE fileData to eliminate massive network payload
    const dbAssets = await prisma.mediaAsset.findMany({
      where,
      select: {
        id: true,
        filename: true,
        originalName: true,
        mimeType: true,
        size: true,
        url: true,
        createdAt: true,
        updatedAt: true
      },
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
          id: asset.id,
          filename: asset.filename,
          originalName: asset.originalName || asset.filename,
          mimeType: asset.mimeType,
          size: asset.size,
          url: canonicalUrl,
          fileUrl: `/api/media/file/${asset.id}`,
          createdAt: asset.createdAt,
          updatedAt: asset.updatedAt
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
 * Handle multipart image/document upload with Sharp WebP high-performance compression
 */
async function uploadMedia(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const uploadDir = path.join(__dirname, '../../client/public/assets/uploads');
    const distUploadDir = path.join(__dirname, '../../client/dist/assets/uploads');
    const rawUploadedPath = req.file.path;

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    let finalFilePath = rawUploadedPath;
    let finalFilename = req.file.filename;
    let finalMimeType = req.file.mimetype || 'application/octet-stream';
    let finalSize = req.file.size;
    let finalBuffer = null;

    const isRasterImage = (finalMimeType.startsWith('image/') || /\.(jpeg|jpg|png|webp|gif|bmp|tiff)$/i.test(req.file.originalname)) &&
      finalMimeType !== 'image/svg+xml' &&
      !req.file.originalname.toLowerCase().endsWith('.svg');

    // 1. High Performance WebP Compression with Sharp
    if (isRasterImage) {
      try {
        const parsed = path.parse(req.file.filename);
        const webpFilename = `${parsed.name}.webp`;
        const webpFilePath = path.join(uploadDir, webpFilename);

        // Auto-orient by EXIF, constrain to max 1920x1920 keeping aspect ratio, convert to high-performance WebP
        const compressedWebpBuffer = await sharp(rawUploadedPath)
          .rotate() // auto-orient portrait/landscape based on EXIF camera metadata
          .resize({
            width: 1920,
            height: 1920,
            fit: 'inside',
            withoutEnlargement: true
          })
          .webp({ quality: 80, effort: 4 })
          .toBuffer();

        // Write compressed WebP to storage
        fs.writeFileSync(webpFilePath, compressedWebpBuffer);

        // If the original temp file was not named with .webp, clean it up
        if (rawUploadedPath !== webpFilePath && fs.existsSync(rawUploadedPath)) {
          try {
            fs.unlinkSync(rawUploadedPath);
          } catch (_) {}
        }

        finalFilePath = webpFilePath;
        finalFilename = webpFilename;
        finalMimeType = 'image/webp';
        finalSize = compressedWebpBuffer.length;
        finalBuffer = compressedWebpBuffer;
      } catch (sharpError) {
        console.warn('[Sharp WebP Compression] Fallback to raw file:', sharpError.message);
        try {
          finalBuffer = fs.readFileSync(rawUploadedPath);
        } catch (_) {}
      }
    } else {
      try {
        finalBuffer = fs.readFileSync(rawUploadedPath);
      } catch (_) {}
    }

    if (!finalBuffer) {
      finalBuffer = fs.readFileSync(finalFilePath);
    }

    const uploadedHash = crypto.createHash('sha256').update(finalBuffer).digest('hex');
    const fileDataBase64 = finalBuffer.toString('base64');

    // 2. Duplicate Detection: Check for identical asset by size and SHA-256 hash
    if (uploadedHash) {
      const candidates = await prisma.mediaAsset.findMany({
        where: { size: finalSize },
        select: {
          id: true,
          filename: true,
          originalName: true,
          mimeType: true,
          size: true,
          url: true,
          fileData: true,
          createdAt: true,
          updatedAt: true
        }
      });

      for (const candidate of candidates) {
        const candidatePath = path.join(uploadDir, candidate.filename);
        let candidateHash = null;
        if (fs.existsSync(candidatePath)) {
          candidateHash = computeFileHash(candidatePath);
        } else if (candidate.fileData) {
          candidateHash = crypto.createHash('sha256').update(Buffer.from(candidate.fileData, 'base64')).digest('hex');
        }

        if (candidateHash && candidateHash === uploadedHash) {
          // Duplicate detected! If candidate lacks fileData, backfill it now
          if (!candidate.fileData && fileDataBase64) {
            await prisma.mediaAsset.update({
              where: { id: candidate.id },
              data: { fileData: fileDataBase64 }
            }).catch(() => {});
          }

          // Remove the redundant file from disk if it was created
          try {
            if (fs.existsSync(finalFilePath) && finalFilePath !== candidatePath) {
              fs.unlinkSync(finalFilePath);
            }
          } catch (e) {}

          const candidateUrl = candidate.url && (candidate.url.startsWith('/') || candidate.url.startsWith('http'))
            ? candidate.url
            : `/assets/uploads/${candidate.filename}`;

          return res.status(200).json({
            success: true,
            isDuplicate: true,
            message: 'Identical media asset already exists in storage. Reused existing asset.',
            url: candidateUrl,
            data: {
              id: candidate.id,
              filename: candidate.filename,
              originalName: candidate.originalName,
              mimeType: candidate.mimeType,
              size: candidate.size,
              url: candidateUrl,
              fileUrl: `/api/media/file/${candidate.id}`,
              createdAt: candidate.createdAt,
              updatedAt: candidate.updatedAt
            }
          });
        }
      }
    }

    // 3. New Unique Asset Registration
    const publicUrl = `/assets/uploads/${finalFilename}`;

    // Mirror to client/dist/assets/uploads if it exists
    if (fs.existsSync(distUploadDir)) {
      try {
        fs.copyFileSync(finalFilePath, path.join(distUploadDir, finalFilename));
      } catch (e) {}
    }

    const asset = await prisma.mediaAsset.create({
      data: {
        filename: finalFilename,
        originalName: req.file.originalname,
        mimeType: finalMimeType,
        size: finalSize,
        url: publicUrl,
        fileData: fileDataBase64
      },
      select: {
        id: true,
        filename: true,
        originalName: true,
        mimeType: true,
        size: true,
        url: true,
        createdAt: true,
        updatedAt: true
      }
    });

    return res.status(201).json({
      success: true,
      isDuplicate: false,
      url: publicUrl,
      data: {
        ...asset,
        url: publicUrl,
        fileUrl: `/api/media/file/${asset.id}`
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
  serveMediaFile,
  syncDiskAssetsToDatabase,
  syncMediaEndpoint
};
