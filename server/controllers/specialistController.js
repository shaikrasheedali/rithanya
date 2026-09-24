const prisma = require('../config/db');
const { getPublicCache, setPublicCache, invalidatePublicCache } = require('../utils/publicDataCache');

async function getSpecialists(req, res, next) {
  try {
    const { status } = req.query;
    const cacheKey = `specialists:list:${status || 'all'}`;
    const cached = getPublicCache(cacheKey);
    if (cached) {
      return res.json({ success: true, data: cached });
    }

    const specialists = await prisma.specialist.findMany({
      where: {
        ...(status && { status })
      },
      orderBy: { sortOrder: 'asc' }
    });

    setPublicCache(cacheKey, specialists);
    return res.json({ success: true, data: specialists });
  } catch (err) {
    next(err);
  }
}

async function getSpecialistBySlugOrId(req, res, next) {
  try {
    const { slugOrId } = req.params;
    const cacheKey = `specialists:item:${slugOrId}`;
    const cached = getPublicCache(cacheKey);
    if (cached) {
      return res.json({ success: true, data: cached });
    }

    let specialist = await prisma.specialist.findFirst({
      where: {
        OR: [
          { slug: slugOrId },
          { id: slugOrId }
        ]
      }
    });

    if (!specialist) {
      const normalize = (str) => (str || '').toLowerCase().replace(/[^a-z0-9]/g, '');
      const cleanParam = normalize(slugOrId);
      const allSpecialists = await prisma.specialist.findMany();
      specialist = allSpecialists.find((s) => {
        const sSlug = normalize(s.slug);
        const sName = normalize(s.name);
        return (
          (s.slug && (s.slug === slugOrId || sSlug === cleanParam)) ||
          sSlug.includes(cleanParam) ||
          cleanParam.includes(sSlug) ||
          sName.includes(cleanParam) ||
          (cleanParam.includes('narayana') && sSlug.includes('narayana')) ||
          (cleanParam.includes('lakshmi') && sSlug.includes('lakshmi'))
        );
      });
    }

    if (!specialist) {
      return res.status(404).json({ success: false, message: 'Specialist not found' });
    }

    setPublicCache(cacheKey, specialist);
    return res.json({ success: true, data: specialist });
  } catch (err) {
    next(err);
  }
}

async function createSpecialist(req, res, next) {
  try {
    const {
      name,
      slug,
      designation,
      title,
      department,
      qualifications,
      qualification,
      registrationNumber,
      experience,
      opdTimings,
      schedule,
      image,
      bio,
      content,
      availableDays,
      status,
      sortOrder
    } = req.body;

    const actualDesignation = designation || title;
    const actualQualifications = qualifications || qualification;
    const actualOpdTimings = opdTimings || schedule;

    if (!name || !actualDesignation || !department) {
      return res.status(400).json({ success: false, message: 'Name, designation/title, and department are required' });
    }

    const baseSlug = (slug || name)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') || `doctor-${Date.now().toString().slice(-4)}`;

    let finalSlug = baseSlug;
    const existingWithSlug = await prisma.specialist.findFirst({ where: { slug: finalSlug } });
    if (existingWithSlug) {
      finalSlug = `${baseSlug}-${Date.now().toString().slice(-4)}`;
    }

    const specialist = await prisma.specialist.create({
      data: {
        slug: finalSlug,
        name,
        designation: actualDesignation,
        department,
        qualifications: actualQualifications || '',
        registrationNumber: registrationNumber || null,
        experience: experience || '',
        opdTimings: actualOpdTimings || '',
        image: image ? image.trim() : '',
        bio: bio || '',
        content: content || null,
        availableDays: availableDays || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        status: status || 'active',
        sortOrder: sortOrder ? parseInt(sortOrder, 10) : 0
      }
    });

    invalidatePublicCache('specialists');
    return res.status(201).json({ success: true, data: specialist });
  } catch (err) {
    next(err);
  }
}

async function updateSpecialist(req, res, next) {
  try {
    const { id } = req.params;
    const allowed = [
      'slug',
      'name',
      'designation',
      'department',
      'qualifications',
      'registrationNumber',
      'experience',
      'opdTimings',
      'image',
      'bio',
      'content',
      'availableDays',
      'status',
      'sortOrder'
    ];
    const updateData = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) updateData[key] = req.body[key];
    }
    if (req.body.title !== undefined && updateData.designation === undefined) updateData.designation = req.body.title;
    if (req.body.qualification !== undefined && updateData.qualifications === undefined) updateData.qualifications = req.body.qualification;
    if (req.body.schedule !== undefined && updateData.opdTimings === undefined) updateData.opdTimings = req.body.schedule;
    if (updateData.sortOrder !== undefined) {
      updateData.sortOrder = parseInt(updateData.sortOrder, 10) || 0;
    }

    const existing = await prisma.specialist.findFirst({
      where: { OR: [{ id }, { slug: id }] }
    });
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Specialist doctor profile not found' });
    }

    const specialist = await prisma.specialist.update({
      where: { id: existing.id },
      data: updateData
    });

    invalidatePublicCache('specialists');
    return res.json({ success: true, data: specialist });
  } catch (err) {
    if (err.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'Specialist doctor profile not found' });
    }
    next(err);
  }
}

async function deleteSpecialist(req, res, next) {
  try {
    const { id } = req.params;
    const existing = await prisma.specialist.findFirst({
      where: { OR: [{ id }, { slug: id }] }
    });
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Specialist doctor profile not found or already removed' });
    }
    await prisma.specialist.delete({ where: { id: existing.id } });
    invalidatePublicCache('specialists');
    return res.json({ success: true, message: 'Specialist deleted' });
  } catch (err) {
    if (err.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'Specialist doctor profile not found or already removed' });
    }
    next(err);
  }
}

module.exports = {
  getSpecialists,
  getSpecialistBySlugOrId,
  createSpecialist,
  updateSpecialist,
  deleteSpecialist
};
