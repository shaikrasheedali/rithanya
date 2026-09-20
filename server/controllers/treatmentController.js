const prisma = require('../config/db');
const { recordAuditLog } = require('../middlewares/auditMiddleware');

// Public: List all treatments
async function getTreatments(req, res, next) {
  try {
    const { category, search, all } = req.query;

    const where = {};
    if (!all) {
      where.status = 'published';
    }
    if (category) {
      where.category = category;
    }
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { summary: { contains: search } },
        { department: { contains: search } }
      ];
    }

    const treatments = await prisma.treatment.findMany({
      where,
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }]
    });

    return res.json({ success: true, data: treatments });
  } catch (err) {
    next(err);
  }
}

// Public: Get detailed treatment by slug
async function getTreatmentBySlug(req, res, next) {
  try {
    const { slug } = req.params;

    const treatment = await prisma.treatment.findFirst({
      where: {
        OR: [{ slug }, { id: slug }]
      }
    });

    if (!treatment) {
      return res.status(404).json({ success: false, message: 'Treatment procedure not found' });
    }

    return res.json({ success: true, data: treatment });
  } catch (err) {
    next(err);
  }
}

// Admin/Staff: Create new Treatment
async function createTreatment(req, res, next) {
  try {
    const {
      title,
      category,
      department,
      doctorName,
      duration,
      indications,
      summary,
      content,
      coverImage,
      videoUrl,
      procedures,
      tag,
      status,
      sortOrder
    } = req.body;

    if (!title || !category || !content) {
      return res.status(400).json({
        success: false,
        message: 'Title, category, and clinical content are required'
      });
    }

    // Generate unique slug
    let baseSlug = title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    let uniqueSlug = baseSlug;
    let count = 1;
    while (await prisma.treatment.findUnique({ where: { slug: uniqueSlug } })) {
      uniqueSlug = `${baseSlug}-${count++}`;
    }

    const newTreatment = await prisma.treatment.create({
      data: {
        slug: uniqueSlug,
        title: title.trim(),
        category: category.trim(),
        department: department || 'General Medicine & Diabetology',
        doctorName: doctorName || 'Dr. Narayana Murthy, MD',
        duration: duration || '45 - 90 mins',
        indications: indications || '',
        summary: summary || title,
        content,
        coverImage: coverImage || 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1200&q=85',
        videoUrl: videoUrl || null,
        procedures: Array.isArray(procedures) ? procedures : [],
        tag: tag || null,
        status: status || 'published',
        sortOrder: sortOrder ? parseInt(sortOrder, 10) : 0
      }
    });

    recordAuditLog({
      actorId: req.user ? req.user.id : null,
      actorName: req.user ? req.user.name : 'Admin',
      actorRole: req.user ? req.user.role : 'ADMIN',
      action: 'CREATE_TREATMENT',
      module: 'TREATMENTS',
      recordId: newTreatment.id,
      ipAddress: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
      details: { title: newTreatment.title, slug: newTreatment.slug }
    });

    return res.status(201).json({ success: true, data: newTreatment });
  } catch (err) {
    next(err);
  }
}

// Admin/Staff: Update Treatment
async function updateTreatment(req, res, next) {
  try {
    const { id } = req.params;

    const existing = await prisma.treatment.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Treatment not found' });
    }

    const updated = await prisma.treatment.update({
      where: { id },
      data: {
        ...req.body,
        procedures: Array.isArray(req.body.procedures) ? req.body.procedures : existing.procedures,
        sortOrder: req.body.sortOrder !== undefined ? parseInt(req.body.sortOrder, 10) : existing.sortOrder
      }
    });

    recordAuditLog({
      actorId: req.user ? req.user.id : null,
      actorName: req.user ? req.user.name : 'Admin',
      actorRole: req.user ? req.user.role : 'ADMIN',
      action: 'UPDATE_TREATMENT',
      module: 'TREATMENTS',
      recordId: id,
      ipAddress: req.headers['x-forwarded-for'] || req.socket.remoteAddress
    });

    return res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
}

// Admin/Staff: Delete Treatment
async function deleteTreatment(req, res, next) {
  try {
    const { id } = req.params;

    await prisma.treatment.delete({ where: { id } });

    recordAuditLog({
      actorId: req.user ? req.user.id : null,
      actorName: req.user ? req.user.name : 'Admin',
      actorRole: req.user ? req.user.role : 'ADMIN',
      action: 'DELETE_TREATMENT',
      module: 'TREATMENTS',
      recordId: id,
      ipAddress: req.headers['x-forwarded-for'] || req.socket.remoteAddress
    });

    return res.json({ success: true, message: 'Treatment deleted successfully' });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getTreatments,
  getTreatmentBySlug,
  createTreatment,
  updateTreatment,
  deleteTreatment
};
