const prisma = require('../config/db');

async function getPackages(req, res, next) {
  try {
    const { status } = req.query;
    const packages = await prisma.productPackage.findMany({
      where: {
        ...(status && { status })
      },
      orderBy: { sortOrder: 'asc' }
    });
    return res.json({ success: true, data: packages });
  } catch (err) {
    next(err);
  }
}

async function createPackage(req, res, next) {
  try {
    const { name, category, price, originalPrice, discountText, summary, features, tag, image, status, sortOrder } = req.body;

    if (!name || !category || !price) {
      return res.status(400).json({ success: false, message: 'Name, category, and price are required' });
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now().toString().slice(-4);

    const pack = await prisma.productPackage.create({
      data: {
        slug,
        name,
        category,
        price: parseFloat(price),
        originalPrice: originalPrice ? parseFloat(originalPrice) : null,
        discountText: discountText || null,
        summary: summary || '',
        features: features || [],
        tag: tag || null,
        image: image || 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1200&q=85',
        status: status || 'active',
        sortOrder: sortOrder ? parseInt(sortOrder, 10) : 0
      }
    });

    return res.status(201).json({ success: true, data: pack });
  } catch (err) {
    next(err);
  }
}

async function updatePackage(req, res, next) {
  try {
    const { id } = req.params;
    const allowed = ['slug', 'name', 'category', 'price', 'originalPrice', 'discountText', 'summary', 'features', 'tag', 'image', 'stock', 'inStock', 'status', 'sortOrder'];
    const updateData = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) updateData[key] = req.body[key];
    }
    if (updateData.price !== undefined) updateData.price = parseFloat(updateData.price);
    if (updateData.originalPrice !== undefined) updateData.originalPrice = parseFloat(updateData.originalPrice);
    if (updateData.sortOrder !== undefined) updateData.sortOrder = parseInt(updateData.sortOrder, 10) || 0;

    const pack = await prisma.productPackage.update({
      where: { id },
      data: updateData
    });

    return res.json({ success: true, data: pack });
  } catch (err) {
    next(err);
  }
}

async function deletePackage(req, res, next) {
  try {
    const { id } = req.params;
    await prisma.productPackage.delete({ where: { id } });
    return res.json({ success: true, message: 'Package deleted' });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getPackages,
  createPackage,
  updatePackage,
  deletePackage
};
