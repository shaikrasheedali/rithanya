const prisma = require('../config/db');
const { getPublicCache, setPublicCache, invalidatePublicCache } = require('../utils/publicDataCache');

async function getGallery(req, res, next) {
  try {
    const { category } = req.query;
    const cacheKey = `gallery:list:${category || 'all'}`;
    const cached = getPublicCache(cacheKey);
    if (cached) {
      return res.json({ success: true, data: cached });
    }

    const items = await prisma.galleryItem.findMany({
      where: {
        ...(category && category !== 'All' && { category })
      },
      orderBy: { sortOrder: 'asc' }
    });

    setPublicCache(cacheKey, items);
    return res.json({ success: true, data: items });
  } catch (err) {
    next(err);
  }
}

async function createGalleryItem(req, res, next) {
  try {
    const { title, category, imageUrl, mediaType, embedUrl, caption, sortOrder } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, message: 'Title is required' });
    }

    const item = await prisma.galleryItem.create({
      data: {
        title,
        category: category || 'Facility',
        imageUrl: imageUrl || 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=85',
        mediaType: mediaType || 'IMAGE',
        embedUrl: embedUrl || null,
        caption: caption || '',
        sortOrder: sortOrder ? parseInt(sortOrder, 10) : 0
      }
    });

    invalidatePublicCache('gallery');
    return res.status(201).json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
}

async function updateGalleryItem(req, res, next) {
  try {
    const { id } = req.params;
    const allowed = ['title', 'category', 'url', 'imageUrl', 'mediaType', 'embedUrl', 'description', 'caption', 'sortOrder'];
    const updateData = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) updateData[key] = req.body[key];
    }
    if (updateData.sortOrder !== undefined) {
      updateData.sortOrder = parseInt(updateData.sortOrder, 10) || 0;
    }

    const item = await prisma.galleryItem.update({
      where: { id },
      data: updateData
    });

    invalidatePublicCache('gallery');
    return res.json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
}

async function deleteGalleryItem(req, res, next) {
  try {
    const { id } = req.params;
    await prisma.galleryItem.delete({ where: { id } });
    invalidatePublicCache('gallery');
    return res.json({ success: true, message: 'Gallery item deleted' });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getGallery,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem
};
