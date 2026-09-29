const path = require('path');
const fs = require('fs');
const prisma = require('../config/db');

const FALLBACK_IMAGE = '/image.png';
const FALLBACK_DOCTOR_IMAGE = '/image.png';

/**
 * Startup Asset Sanitizer & Rehydration Engine
 * 1. Rehydrates all MediaAsset base64 payloads to physical disk on server startup.
 * 2. Scans clinical entities (Services, Treatments, Specialists, Products, Blogs, Gallery)
 *    and repairs any stale/broken image references to verified local fallbacks.
 */
async function sanitizeDatabaseAssets() {
  console.log('[Asset Sanitizer] Starting boot asset audit and database reference sanitization...');
  const uploadsDir = path.join(__dirname, '../../client/public/assets/uploads');
  const distUploadsDir = path.join(__dirname, '../../client/dist/assets/uploads');

  try {
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
  } catch (_) {}

  try {
    // 1. Fetch all MediaAssets from database
    const dbAssets = await prisma.mediaAsset.findMany();
    const validDbFilenames = new Set();
    const validDbIds = new Set();

    let rehydratedCount = 0;
    for (const asset of dbAssets) {
      if (asset.filename) validDbFilenames.add(asset.filename.toLowerCase());
      if (asset.id) validDbIds.add(asset.id);

      // Rehydrate to disk if fileData is present and missing on disk
      if (asset.fileData && asset.filename) {
        const publicFile = path.join(uploadsDir, asset.filename);
        if (!fs.existsSync(publicFile)) {
          try {
            const buffer = Buffer.from(asset.fileData, 'base64');
            fs.writeFileSync(publicFile, buffer);
            rehydratedCount++;

            // Also mirror to dist if dist exists
            if (fs.existsSync(distUploadsDir)) {
              try {
                fs.writeFileSync(path.join(distUploadsDir, asset.filename), buffer);
              } catch (_) {}
            }
          } catch (e) {
            // Rehydration error for individual file ignored
          }
        }
      }
    }

    if (rehydratedCount > 0) {
      console.log(`[Asset Sanitizer] ✓ Rehydrated ${rehydratedCount} media assets from database to physical disk.`);
    }

    // 2. Discover all physical files on disk
    const diskFiles = new Set();
    try {
      if (fs.existsSync(uploadsDir)) {
        fs.readdirSync(uploadsDir).forEach((f) => diskFiles.add(f.toLowerCase()));
      }
      if (fs.existsSync(distUploadsDir)) {
        fs.readdirSync(distUploadsDir).forEach((f) => diskFiles.add(f.toLowerCase()));
      }
    } catch (_) {}

    /**
     * Helper to verify if an image reference is valid or broken
     */
    function isAssetValid(url) {
      if (!url || typeof url !== 'string') return false;
      const trimmed = url.trim();
      if (!trimmed) return false;

      // Absolute HTTP/HTTPS URLs, data URIs, or root public assets are valid
      if (/^https?:\/\//i.test(trimmed) || trimmed.startsWith('data:') || trimmed.startsWith('blob:')) {
        return true;
      }

      // Root level public assets
      if (
        trimmed === '/image.png' ||
        trimmed === '/logo.jpeg' ||
        trimmed === '/logo.svg' ||
        trimmed === '/favicon.ico' ||
        trimmed.startsWith('/Dr ')
      ) {
        return true;
      }

      // Extract filename from uploads or media file paths
      const filenameMatch = trimmed.match(/\/([^\/?#]+)$/);
      if (filenameMatch) {
        const fname = filenameMatch[1].toLowerCase();
        // Check if exists in DB or on disk
        if (validDbFilenames.has(fname) || diskFiles.has(fname) || validDbIds.has(fname)) {
          return true;
        }
      }

      return false;
    }

    let sanitizedCount = 0;

    // 3. Sanitize Services
    try {
      const services = await prisma.service.findMany({ select: { id: true, title: true, coverImage: true, galleryImages: true } });
      for (const s of services) {
        let needsUpdate = false;
        let newCover = s.coverImage;
        let newGallery = s.galleryImages;

        if (!isAssetValid(s.coverImage)) {
          newCover = FALLBACK_IMAGE;
          needsUpdate = true;
        }

        if (Array.isArray(s.galleryImages)) {
          const sanitizedGallery = s.galleryImages.map((img) => (isAssetValid(img) ? img : FALLBACK_IMAGE));
          if (JSON.stringify(sanitizedGallery) !== JSON.stringify(s.galleryImages)) {
            newGallery = sanitizedGallery;
            needsUpdate = true;
          }
        }

        if (needsUpdate) {
          await prisma.service.update({
            where: { id: s.id },
            data: { coverImage: newCover, galleryImages: newGallery }
          });
          sanitizedCount++;
        }
      }
    } catch (e) {
      console.warn('[Asset Sanitizer] Note during Services check:', e.message);
    }

    // 4. Sanitize Treatments
    try {
      const treatments = await prisma.treatment.findMany({ select: { id: true, title: true, coverImage: true } });
      for (const t of treatments) {
        if (!isAssetValid(t.coverImage)) {
          await prisma.treatment.update({
            where: { id: t.id },
            data: { coverImage: FALLBACK_IMAGE }
          });
          sanitizedCount++;
        }
      }
    } catch (e) {
      console.warn('[Asset Sanitizer] Note during Treatments check:', e.message);
    }

    // 5. Sanitize Specialists / Doctors
    try {
      const specialists = await prisma.specialist.findMany({ select: { id: true, name: true, image: true } });
      for (const sp of specialists) {
        if (!isAssetValid(sp.image)) {
          await prisma.specialist.update({
            where: { id: sp.id },
            data: { image: FALLBACK_DOCTOR_IMAGE }
          });
          sanitizedCount++;
        }
      }
    } catch (e) {
      console.warn('[Asset Sanitizer] Note during Specialists check:', e.message);
    }

    // 6. Sanitize Products / Packages
    try {
      const products = await prisma.productPackage.findMany({ select: { id: true, name: true, image: true } });
      for (const p of products) {
        if (!isAssetValid(p.image)) {
          await prisma.productPackage.update({
            where: { id: p.id },
            data: { image: FALLBACK_IMAGE }
          });
          sanitizedCount++;
        }
      }
    } catch (e) {
      console.warn('[Asset Sanitizer] Note during Products check:', e.message);
    }

    // 7. Sanitize Blogs
    try {
      const blogs = await prisma.blog.findMany({ select: { id: true, title: true, coverImage: true } });
      for (const b of blogs) {
        if (!isAssetValid(b.coverImage)) {
          await prisma.blog.update({
            where: { id: b.id },
            data: { coverImage: FALLBACK_IMAGE }
          });
          sanitizedCount++;
        }
      }
    } catch (e) {
      console.warn('[Asset Sanitizer] Note during Blogs check:', e.message);
    }

    // 8. Sanitize Gallery Items
    try {
      const gallery = await prisma.galleryItem.findMany({ select: { id: true, title: true, imageUrl: true } });
      for (const g of gallery) {
        if (!isAssetValid(g.imageUrl)) {
          await prisma.galleryItem.update({
            where: { id: g.id },
            data: { imageUrl: FALLBACK_IMAGE }
          });
          sanitizedCount++;
        }
      }
    } catch (e) {
      console.warn('[Asset Sanitizer] Note during Gallery check:', e.message);
    }

    console.log(`[Asset Sanitizer] ✓ Asset audit complete. Sanitized ${sanitizedCount} stale entity image references.`);
    return { success: true, rehydratedCount, sanitizedCount };
  } catch (err) {
    console.warn('[Asset Sanitizer] Notice during asset sanitization:', err.message);
    return { success: false, error: err.message };
  }
}

module.exports = {
  sanitizeDatabaseAssets,
  FALLBACK_IMAGE,
  FALLBACK_DOCTOR_IMAGE
};
