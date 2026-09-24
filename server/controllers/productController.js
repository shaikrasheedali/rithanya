const prisma = require('../config/db');
const { getPublicCache, setPublicCache, invalidatePublicCache } = require('../utils/publicDataCache');

async function getPackages(req, res, next) {
  try {
    const { status } = req.query;
    const cacheKey = `products:list:${status || 'all'}`;
    const cached = getPublicCache(cacheKey);
    if (cached) {
      return res.json({ success: true, data: cached });
    }

    const packages = await prisma.productPackage.findMany({
      where: {
        ...(status && { status })
      },
      orderBy: { sortOrder: 'asc' }
    });

    setPublicCache(cacheKey, packages);
    return res.json({ success: true, data: packages });
  } catch (err) {
    next(err);
  }
}

async function getPackageBySlugOrId(req, res, next) {
  try {
    const { slugOrId } = req.params;
    const cacheKey = `products:item:${slugOrId}`;
    const cached = getPublicCache(cacheKey);
    if (cached) {
      return res.json({ success: true, data: cached });
    }

    let pack = await prisma.productPackage.findFirst({
      where: {
        OR: [
          { slug: slugOrId },
          { id: slugOrId }
        ]
      }
    });

    if (!pack) {
      const normalize = (str) => (str || '').toLowerCase().replace(/[^a-z0-9]/g, '');
      const cleanParam = normalize(slugOrId);
      const allPacks = await prisma.productPackage.findMany();
      pack = allPacks.find((p) => {
        const pSlug = normalize(p.slug);
        const pName = normalize(p.name);
        return (
          (p.slug && (p.slug === slugOrId || pSlug === cleanParam)) ||
          pSlug.includes(cleanParam) ||
          cleanParam.includes(pSlug) ||
          pName.includes(cleanParam)
        );
      });
    }

    if (!pack) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    setPublicCache(cacheKey, pack);
    return res.json({ success: true, data: pack });
  } catch (err) {
    next(err);
  }
}

async function createPackage(req, res, next) {
  try {
    const {
      name,
      slug,
      category,
      price,
      originalPrice,
      discountText,
      summary,
      features,
      tag,
      image,
      videoUrl,
      content,
      stock,
      inStock,
      status,
      sortOrder
    } = req.body;

    if (!name || !category || price === undefined) {
      return res.status(400).json({ success: false, message: 'Name, category, and price are required' });
    }

    const generatedSlug = (slug || name)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const pack = await prisma.productPackage.create({
      data: {
        slug: generatedSlug,
        name,
        category,
        price: parseFloat(price),
        originalPrice: originalPrice ? parseFloat(originalPrice) : null,
        discountText: discountText || null,
        summary: summary || '',
        features: features || [],
        tag: tag || null,
        image: image || '/assets/product-placeholder.jpg',
        videoUrl: videoUrl || null,
        content: content || null,
        stock: stock !== undefined ? parseInt(stock, 10) : 50,
        inStock: inStock !== undefined ? Boolean(inStock) : true,
        status: status || 'active',
        sortOrder: sortOrder ? parseInt(sortOrder, 10) : 0
      }
    });

    invalidatePublicCache('products');
    return res.status(201).json({ success: true, data: pack });
  } catch (err) {
    next(err);
  }
}

async function updatePackage(req, res, next) {
  try {
    const { id } = req.params;
    const allowed = [
      'slug',
      'name',
      'category',
      'price',
      'originalPrice',
      'discountText',
      'summary',
      'features',
      'tag',
      'image',
      'videoUrl',
      'content',
      'stock',
      'inStock',
      'status',
      'sortOrder'
    ];
    const updateData = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) updateData[key] = req.body[key];
    }
    if (updateData.price !== undefined) updateData.price = parseFloat(updateData.price);
    if (updateData.originalPrice !== undefined) updateData.originalPrice = parseFloat(updateData.originalPrice);
    if (updateData.stock !== undefined) updateData.stock = parseInt(updateData.stock, 10);
    if (updateData.sortOrder !== undefined) updateData.sortOrder = parseInt(updateData.sortOrder, 10) || 0;

    const pack = await prisma.productPackage.update({
      where: { id },
      data: updateData
    });

    invalidatePublicCache('products');
    return res.json({ success: true, data: pack });
  } catch (err) {
    next(err);
  }
}

async function deletePackage(req, res, next) {
  try {
    const { id } = req.params;
    const existing = await prisma.productPackage.findFirst({
      where: { OR: [{ id }, { slug: id }] }
    });
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Healthcare product or package not found or already removed' });
    }
    await prisma.productPackage.delete({ where: { id: existing.id } });
    invalidatePublicCache('products');
    return res.json({ success: true, message: 'Package deleted' });
  } catch (err) {
    if (err.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'Healthcare product or package not found or already removed' });
    }
    next(err);
  }
}

module.exports = {
  getPackages,
  getPackageBySlugOrId,
  createPackage,
  updatePackage,
  deletePackage
};
