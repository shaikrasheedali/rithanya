const test = require('node:test');
const assert = require('node:assert');
const request = require('supertest');
const { app } = require('../../index');

test('Rithanya Hospital - Gallery Multi-Asset Carousel, Embeds & Catalog Test Suite', async (t) => {
  let adminToken = null;
  let singleItemId = null;
  let carouselItemId = null;
  let ytEmbedItemId = null;
  let igEmbedItemId = null;
  let uploadedVideoUrl = null;

  // 1. Authenticate Admin
  await t.test('POST /api/auth/login - Admin authentication', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'admin@rithanyahospital.com',
      password: 'Admin@2026'
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.ok(res.body.token);
    adminToken = res.body.token;
  });

  // 2. Test Video Upload endpoint (MP4)
  await t.test('POST /api/upload - Accepts MP4 video file and returns valid storage URL', async () => {
    const fakeVideoBuffer = Buffer.from('fake mp4 video binary stream data');
    const res = await request(app)
      .post('/api/upload')
      .set('Authorization', `Bearer ${adminToken}`)
      .attach('file', fakeVideoBuffer, 'clinical_tour.mp4');

    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.body.success, true);
    assert.ok(res.body.url.includes('.mp4'));
    uploadedVideoUrl = res.body.url;
  });

  // 2b. Test Duplicate Asset Upload Detection
  await t.test('POST /api/upload - Identical file upload is detected as duplicate and reuses existing asset', async () => {
    const fakeVideoBuffer = Buffer.from('fake mp4 video binary stream data');
    const res = await request(app)
      .post('/api/upload')
      .set('Authorization', `Bearer ${adminToken}`)
      .attach('file', fakeVideoBuffer, 'clinical_tour_duplicate.mp4');

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.strictEqual(res.body.isDuplicate, true);
    assert.strictEqual(res.body.url, uploadedVideoUrl);
  });

  // 2c. Test GET /api/media/assets endpoint
  await t.test('GET /api/media/assets - Returns uploaded media assets list for library picker', async () => {
    const res = await request(app)
      .get('/api/media/assets')
      .set('Authorization', `Bearer ${adminToken}`);

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.ok(Array.isArray(res.body.assets));
  });

  // 3. Create Single Image Gallery Item
  await t.test('POST /api/gallery - Create single image gallery item', async () => {
    const res = await request(app)
      .post('/api/gallery')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        title: 'Central Hematology Bio-Analyzer Laboratory',
        category: 'Diagnostics',
        mediaType: 'IMAGE',
        imageUrl: '/assets/uploads/bioanalyzer.webp',
        embedUrl: '',
        caption: 'Automated 5-part differential cell counter'
      });

    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.body.success, true);
    assert.ok(res.body.data.id);
    singleItemId = res.body.data.id;
  });

  // 4. Create Multi-Asset Carousel Gallery Item
  await t.test('POST /api/gallery - Create multi-asset Carousel item (3 assets)', async () => {
    const carouselData = {
      type: 'CAROUSEL',
      assets: [
        { url: '/assets/uploads/daycare_bed1.webp', type: 'IMAGE' },
        { url: '/assets/uploads/daycare_bed2.webp', type: 'IMAGE' },
        { url: uploadedVideoUrl || '/assets/uploads/ward_walkthrough.mp4', type: 'VIDEO' }
      ]
    };

    const res = await request(app)
      .post('/api/gallery')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        title: 'Daycare Transfusion Ward Complete Tour',
        category: 'Daycare',
        mediaType: 'CAROUSEL',
        imageUrl: '/assets/uploads/daycare_bed1.webp',
        embedUrl: JSON.stringify(carouselData),
        caption: 'Clean, sanitized 10-bed pediatric and adult transfusion suites.'
      });

    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.body.success, true);
    assert.ok(res.body.data.id);
    carouselItemId = res.body.data.id;
  });

  // 5. Create YouTube iframe embed gallery item
  await t.test('POST /api/gallery - Create YouTube iframe embed gallery item', async () => {
    const ytIframe = '<iframe width="560" height="315" src="https://www.youtube.com/embed/RCTYyo82UAA?controls=0" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';

    const res = await request(app)
      .post('/api/gallery')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        title: 'Dr. Narayana Murthy - Diabetes Care Protocol',
        category: 'Specialists',
        mediaType: 'YOUTUBE',
        imageUrl: '/assets/images/defaults/hospital-tour.webp',
        embedUrl: ytIframe,
        caption: 'Clinical guidance on comprehensive diabetes screening and HbA1c management.'
      });

    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.body.success, true);
    assert.ok(res.body.data.id);
    ytEmbedItemId = res.body.data.id;
  });

  // 6. Create Instagram embed gallery item
  await t.test('POST /api/gallery - Create Instagram embed gallery item', async () => {
    const igEmbed = '<blockquote class="instagram-media" data-instgrm-permalink="https://www.instagram.com/reel/Dc8rTWMqjWw/?utm_source=ig_embed&amp;utm_campaign=loading" data-instgrm-version="14"></blockquote>';

    const res = await request(app)
      .post('/api/gallery')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        title: 'OPD Clinical Session Reel',
        category: 'Facility',
        mediaType: 'INSTAGRAM',
        imageUrl: '/assets/images/defaults/hospital-tour.webp',
        embedUrl: igEmbed,
        caption: 'Highlights from our specialized OPD consultations.'
      });

    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.body.success, true);
    assert.ok(res.body.data.id);
    igEmbedItemId = res.body.data.id;
  });

  // 7. Verify Public GET /api/gallery returns all items
  await t.test('GET /api/gallery - Public gallery catalog returns created items', async () => {
    const res = await request(app).get('/api/gallery');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.ok(Array.isArray(res.body.data));

    const carouselItem = res.body.data.find((item) => item.id === carouselItemId);
    assert.ok(carouselItem, 'Carousel item must exist in gallery list');
    assert.strictEqual(carouselItem.mediaType, 'CAROUSEL');

    const parsed = JSON.parse(carouselItem.embedUrl);
    assert.strictEqual(parsed.type, 'CAROUSEL');
    assert.strictEqual(parsed.assets.length, 3);
  });

  // 8. Test Doctor/Specialist CRUD
  let createdSpecialistId = null;
  await t.test('POST /api/specialists - Create specialist with image', async () => {
    const res = await request(app)
      .post('/api/specialists')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Dr. Test Consultant',
        designation: 'Visiting Senior Cardiologist',
        qualification: 'MBBS, MD, DM (Cardiology)',
        experienceYears: 15,
        department: 'Cardiology',
        consultationFee: 750,
        imageUrl: '/assets/uploads/test_doctor.webp',
        about: 'Expert in clinical cardiometabolic evaluations and preventative heart health.',
        opdTimings: 'Mon - Sat: 10:00 AM - 1:00 PM',
        published: true
      });

    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.body.success, true);
    assert.ok(res.body.data.id);
    createdSpecialistId = res.body.data.id;
  });

  await t.test('GET /api/specialists - Public specialist catalog returns doctor', async () => {
    const res = await request(app).get('/api/specialists');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    const doc = res.body.data.find((d) => d.id === createdSpecialistId);
    assert.ok(doc);
    assert.strictEqual(doc.name, 'Dr. Test Consultant');
  });

  // 9. Cleanup Created Items
  await t.test('DELETE items - Clean up created test items', async () => {
    if (singleItemId) {
      await request(app).delete(`/api/gallery/${singleItemId}`).set('Authorization', `Bearer ${adminToken}`);
    }
    if (carouselItemId) {
      await request(app).delete(`/api/gallery/${carouselItemId}`).set('Authorization', `Bearer ${adminToken}`);
    }
    if (ytEmbedItemId) {
      await request(app).delete(`/api/gallery/${ytEmbedItemId}`).set('Authorization', `Bearer ${adminToken}`);
    }
    if (igEmbedItemId) {
      await request(app).delete(`/api/gallery/${igEmbedItemId}`).set('Authorization', `Bearer ${adminToken}`);
    }
    if (createdSpecialistId) {
      await request(app).delete(`/api/specialists/${createdSpecialistId}`).set('Authorization', `Bearer ${adminToken}`);
    }
  });
});
