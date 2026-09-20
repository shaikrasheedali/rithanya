const prisma = require('../config/db');

async function getSpecialists(req, res, next) {
  try {
    const { status } = req.query;
    const specialists = await prisma.specialist.findMany({
      where: {
        ...(status && { status })
      },
      orderBy: { sortOrder: 'asc' }
    });
    return res.json({ success: true, data: specialists });
  } catch (err) {
    next(err);
  }
}

async function createSpecialist(req, res, next) {
  try {
    const { name, designation, department, qualifications, experience, opdTimings, image, bio, availableDays, status, sortOrder } = req.body;

    if (!name || !designation || !department) {
      return res.status(400).json({ success: false, message: 'Name, designation, and department are required' });
    }

    const specialist = await prisma.specialist.create({
      data: {
        name,
        designation,
        department,
        qualifications: qualifications || 'MBBS, MD',
        experience: experience || '10+ Years',
        opdTimings: opdTimings || 'Mon - Sat: 11:00 AM - 5:00 PM',
        image: image || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=1200&q=85',
        bio: bio || '',
        availableDays: availableDays || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        status: status || 'active',
        sortOrder: sortOrder ? parseInt(sortOrder, 10) : 0
      }
    });

    return res.status(201).json({ success: true, data: specialist });
  } catch (err) {
    next(err);
  }
}

async function updateSpecialist(req, res, next) {
  try {
    const { id } = req.params;
    const allowed = ['name', 'qualification', 'designation', 'department', 'experience', 'opdTimings', 'image', 'bio', 'sortOrder'];
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

    return res.json({ success: true, data: specialist });
  } catch (err) {
    next(err);
  }
}

async function deleteSpecialist(req, res, next) {
  try {
    const { id } = req.params;
    await prisma.specialist.delete({ where: { id } });
    return res.json({ success: true, message: 'Specialist deleted' });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getSpecialists,
  createSpecialist,
  updateSpecialist,
  deleteSpecialist
};
