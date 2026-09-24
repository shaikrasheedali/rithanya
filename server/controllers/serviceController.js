const prisma = require('../config/db');
const { getPublicCache, setPublicCache, invalidatePublicCache } = require('../utils/publicDataCache');

async function getServices(req, res, next) {
  try {
    const { status } = req.query;
    const cacheKey = `services:list:${status || 'all'}`;
    const cached = getPublicCache(cacheKey);
    if (cached) {
      return res.json({ success: true, data: cached });
    }

    const services = await prisma.service.findMany({
      where: {
        ...(status && { status })
      },
      orderBy: { sortOrder: 'asc' }
    });

    setPublicCache(cacheKey, services);
    return res.json({ success: true, data: services });
  } catch (err) {
    next(err);
  }
}

async function getServiceBySlug(req, res, next) {
  try {
    const { slug } = req.params;
    const cacheKey = `services:item:${slug}`;
    const cached = getPublicCache(cacheKey);
    if (cached) {
      return res.json({ success: true, data: cached });
    }

    const service = await prisma.service.findFirst({
      where: {
        OR: [{ slug }, { id: slug }]
      }
    });

    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    setPublicCache(cacheKey, service);
    return res.json({ success: true, data: service });
  } catch (err) {
    next(err);
  }
}

async function createService(req, res, next) {
  try {
    const { category, title, author, readTime, status, summary, content, coverImage, galleryImages, sortOrder } = req.body;

    if (!title || !category || !summary || !content) {
      return res.status(400).json({ success: false, message: 'Title, category, summary, and content are required' });
    }

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now().toString().slice(-4);

    const service = await prisma.service.create({
      data: {
        slug,
        category,
        title,
        author: author || 'Dr. Narayana Murthy, MD',
        readTime: readTime || '5 min overview',
        status: status || 'published',
        summary,
        content,
        coverImage: coverImage || 'https://images.unsplash.com/photo-1666214280557-f1b5022eb634?auto=format&fit=crop&w=1200&q=85',
        galleryImages: galleryImages || [],
        sortOrder: sortOrder ? parseInt(sortOrder, 10) : 0
      }
    });

    invalidatePublicCache('services');
    return res.status(201).json({ success: true, data: service });
  } catch (err) {
    next(err);
  }
}

async function updateService(req, res, next) {
  try {
    const { id } = req.params;
    const allowed = ['slug', 'title', 'category', 'description', 'icon', 'coverImage', 'highlights', 'sortOrder', 'summary', 'content', 'status'];
    const updateData = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) updateData[key] = req.body[key];
    }
    if (updateData.sortOrder !== undefined) {
      updateData.sortOrder = parseInt(updateData.sortOrder, 10) || 0;
    }

    const service = await prisma.service.update({
      where: { id },
      data: updateData
    });

    invalidatePublicCache('services');
    return res.json({ success: true, data: service });
  } catch (err) {
    next(err);
  }
}

async function deleteService(req, res, next) {
  try {
    const { id } = req.params;
    const existing = await prisma.service.findFirst({
      where: { OR: [{ id }, { slug: id }] }
    });
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Service specialty not found or already removed' });
    }
    await prisma.service.delete({ where: { id: existing.id } });
    invalidatePublicCache('services');
    return res.json({ success: true, message: 'Service deleted' });
  } catch (err) {
    if (err.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'Service specialty not found or already removed' });
    }
    next(err);
  }
}

module.exports = {
  getServices,
  getServiceBySlug,
  createService,
  updateService,
  deleteService
};
