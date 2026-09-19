const prisma = require('../config/db');

async function getSettings(req, res, next) {
  try {
    const settings = await prisma.hospitalSetting.findMany();
    const map = {};
    settings.forEach((s) => {
      map[s.key] = s.value;
    });

    return res.json({ success: true, data: map });
  } catch (err) {
    next(err);
  }
}

async function updateSetting(req, res, next) {
  try {
    const { key } = req.params;
    const { value, description } = req.body;

    const setting = await prisma.hospitalSetting.upsert({
      where: { key },
      update: {
        value,
        ...(description && { description })
      },
      create: {
        key,
        value,
        description: description || null
      }
    });

    return res.json({ success: true, data: setting });
  } catch (err) {
    next(err);
  }
}

async function exportBackup(req, res, next) {
  try {
    const patients = await prisma.patient.findMany({ where: { isErased: false } });
    const clinical = await prisma.clinicalReading.findMany();
    const inventory = await prisma.bloodInventory.findMany();
    const services = await prisma.service.findMany();
    const blogs = await prisma.blog.findMany();
    const appointments = await prisma.appointment.findMany();

    const backup = {
      hospital: 'Rithanya Hospital & Daycare Transfusion Centre',
      exportedAt: new Date().toISOString(),
      patients,
      clinical,
      inventory,
      services,
      blogs,
      appointments
    };

    return res.json({ success: true, data: backup });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getSettings,
  updateSetting,
  exportBackup
};
