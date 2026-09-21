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
      department,
      qualifications,
      registrationNumber,
      experience,
      opdTimings,
      image,
      bio,
      content,
      availableDays,
      status,
      sortOrder
    } = req.body;

    if (!name || !designation || !department) {
      return res.status(400).json({ success: false, message: 'Name, designation, and department are required' });
    }

    const generatedSlug = (slug || name)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const specialist = await prisma.specialist.create({
      data: {
        slug: generatedSlug,
        name,
        designation,
        department,
        qualifications: qualifications || 'MBBS, MD',
        registrationNumber: registrationNumber || null,
        experience: experience || '15+ Years',
        opdTimings: opdTimings || 'Mon - Sat: 11:00 AM - 5:00 PM',
        image: image || '/assets/specialist-placeholder.jpg',
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
    if (updateData.sortOrder !== undefined) {
      updateData.sortOrder = parseInt(updateData.sortOrder, 10) || 0;
    }

    const specialist = await prisma.specialist.update({
      where: { id },
      data: updateData
    });

    invalidatePublicCache('specialists');
    return res.json({ success: true, data: specialist });
  } catch (err) {
    next(err);
  }
}

async function deleteSpecialist(req, res, next) {
  try {
    const { id } = req.params;
    await prisma.specialist.delete({ where: { id } });
    invalidatePublicCache('specialists');
    return res.json({ success: true, message: 'Specialist deleted' });
  } catch (err) {
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
