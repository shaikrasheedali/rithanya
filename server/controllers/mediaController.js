const prisma = require('../config/db');

const ASSET_LIBRARY_PRESETS = [
  { title: 'Doctor Examination', url: 'https://images.unsplash.com/photo-1666214280557-f1b5022eb634?auto=format&fit=crop&w=1200&q=85' },
  { title: 'Glucose & Metabolic Monitoring', url: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1200&q=85' },
  { title: 'Transfusion Daycare Bed', url: 'https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&w=1200&q=85' },
  { title: 'Clinical Laboratory Analyzers', url: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=1200&q=85' },
  { title: 'Pediatric Care & Stethoscope', url: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=1200&q=85' },
  { title: 'Senior Health Evaluation', url: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1200&q=85' },
  { title: 'Modern Clean Clinic Room', url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=85' },
  { title: 'Senior Physician Portrait', url: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=1200&q=85' },
  { title: 'Hospital Daycare Nurse Care', url: 'https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=1200&q=85' },
  { title: 'Clinical Consultation Desk', url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=85' },
  { title: 'Hospital Transfusion Operations', url: 'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?auto=format&fit=crop&w=1200&q=85' }
];

async function getMediaAssets(req, res, next) {
  try {
    const dbAssets = await prisma.mediaAsset.findMany({
      orderBy: { createdAt: 'desc' }
    });

    return res.json({
      success: true,
      data: {
        presets: ASSET_LIBRARY_PRESETS,
        uploaded: dbAssets
      }
    });
  } catch (err) {
    next(err);
  }
}

async function uploadMedia(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const publicUrl = `/assets/uploads/${req.file.filename}`;

    const asset = await prisma.mediaAsset.create({
      data: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
        size: req.file.size,
        url: publicUrl
      }
    });

    return res.status(201).json({ success: true, data: asset });
  } catch (err) {
    next(err);
  }
}

async function deleteMedia(req, res, next) {
  try {
    const { id } = req.params;
    await prisma.mediaAsset.delete({ where: { id } });
    return res.json({ success: true, message: 'Asset deleted' });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getMediaAssets,
  uploadMedia,
  deleteMedia
};
