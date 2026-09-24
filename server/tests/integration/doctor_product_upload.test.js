const test = require('node:test');
const assert = require('node:assert');
const request = require('supertest');
const { app } = require('../../index');

test('Rithanya Hospital - Doctor, Product & Upload Comprehensive CRUD Suite', async (t) => {
  let superadminToken = null;
  let adminToken = null;
  let createdDoctorId = null;
  let createdDoctorSlug = null;
  let createdProductId = null;
  let uploadedFileUrl = null;

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

  // 2. Test Image Upload Endpoints (/api/upload & /upload alias)
  await t.test('POST /api/upload - Upload file as authenticated staff returns valid JSON with url', async () => {
    const fakeBuffer = Buffer.from('fake image content for testing');
    const res = await request(app)
      .post('/api/upload')
      .set('Authorization', `Bearer ${adminToken}`)
      .attach('file', fakeBuffer, 'test_doctor_photo.png');

    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.body.success, true);
    assert.ok(res.body.url, 'Top-level url must exist');
    assert.ok(res.body.data && res.body.data.url, 'data.url must exist');
    assert.ok(res.headers['content-type'].includes('application/json'));
    uploadedFileUrl = res.body.url;
  });

  await t.test('POST /upload - Upload alias works identically and returns valid JSON', async () => {
    const fakeBuffer = Buffer.from('fake image content for testing alias');
    const res = await request(app)
      .post('/upload')
      .set('Authorization', `Bearer ${adminToken}`)
      .attach('file', fakeBuffer, 'alias_test.png');

    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.body.success, true);
    assert.ok(res.body.url);
    assert.ok(res.headers['content-type'].includes('application/json'));
  });

  await t.test('POST /api/upload - Missing auth returns 401 JSON, never HTML', async () => {
    const fakeBuffer = Buffer.from('fake image content');
    const res = await request(app)
      .post('/api/upload')
      .attach('file', fakeBuffer, 'unauth.png');

    assert.strictEqual(res.status, 401);
    assert.strictEqual(res.body.success, false);
    assert.ok(res.headers['content-type'].includes('application/json'));
  });

  await t.test('GET /api/nonexistent-route - 404 returns JSON, never HTML', async () => {
    const res = await request(app).get('/api/nonexistent-route');
    assert.strictEqual(res.status, 404);
    assert.strictEqual(res.body.success, false);
    assert.ok(res.headers['content-type'].includes('application/json'));
  });

  // 3. Specialist / Doctor CRUD
  await t.test('POST /api/specialists - Create new doctor with clean/empty image', async () => {
    const uniqueEmail = `testdoc.${Date.now()}@rithanya.org`;
    const res = await request(app)
      .post('/api/specialists')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Dr. Test Senior Diabetologist',
        title: 'Senior Consultant Diabetologist',
        department: 'Diabetology & Endocrinology',
        qualifications: 'MBBS, MD (Medicine), Fellowship in Diabetology',
        experienceYears: 12,
        email: uniqueEmail,
        phone: '+91 98480 99887',
        bio: 'Leading physician with expertise in complex metabolic syndrome management and intensive glycemic control.',
        opdSchedule: 'Mon - Fri: 10:00 AM - 02:00 PM',
        consultationFee: 500,
        registrationNumber: 'TSMC-88992',
        image: '', // clean default image (empty string)
        isActive: true
      });

    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.body.success, true);
    assert.ok(res.body.data.id);
    assert.ok(res.body.data.slug);
    assert.strictEqual(res.body.data.image, '');
    createdDoctorId = res.body.data.id;
    createdDoctorSlug = res.body.data.slug;
  });

  await t.test('GET /api/specialists - Retrieve public doctors list', async () => {
    const res = await request(app).get('/api/specialists');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.ok(Array.isArray(res.body.data));
    const found = res.body.data.find((d) => d.id === createdDoctorId);
    assert.ok(found, 'Created doctor should appear in specialists list');
  });

  await t.test('GET /api/specialists/:slug - Retrieve doctor by slug', async () => {
    const res = await request(app).get(`/api/specialists/${createdDoctorSlug}`);
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.strictEqual(res.body.data.id, createdDoctorId);
  });

  await t.test('PUT /api/specialists/:id - Update doctor with uploaded image url', async () => {
    const res = await request(app)
      .put(`/api/specialists/${createdDoctorId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        title: 'Chief Diabetologist & Clinical Director',
        experience: '14+ Years',
        image: uploadedFileUrl || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80'
      });

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.strictEqual(res.body.data.designation, 'Chief Diabetologist & Clinical Director');
    assert.strictEqual(res.body.data.experience, '14+ Years');
  });

  await t.test('DELETE /api/specialists/:id - Delete created doctor', async () => {
    const res = await request(app)
      .delete(`/api/specialists/${createdDoctorId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
  });

  await t.test('DELETE /api/specialists/:id - Deleting non-existent doctor returns clean 404 JSON', async () => {
    const res = await request(app)
      .delete('/api/specialists/non-existent-doctor-id-9999')
      .set('Authorization', `Bearer ${adminToken}`);

    assert.strictEqual(res.status, 404);
    assert.strictEqual(res.body.success, false);
    assert.ok(res.headers['content-type'].includes('application/json'));
  });

  // 4. Product Package CRUD (including videoUrl & content fields)
  await t.test('POST /api/products - Create product package with videoUrl and content', async () => {
    const res = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Advanced Continuous Glucose Monitor (CGM) Kit',
        category: 'Monitoring Devices',
        price: 4999,
        originalPrice: 6500,
        summary: '14-day continuous interstitial glucose tracker with real-time mobile telemetry.',
        description: 'Complete kit including sensor applicator, bluetooth transmitter, and alcohol prep pads.',
        image: uploadedFileUrl || 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=600&q=80',
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        content: '<h3>How to Apply</h3><p>Sterilize upper arm and apply applicator firmly.</p>',
        inStock: true,
        stockCount: 25,
        tag: 'Top Recommended'
      });

    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.body.success, true);
    assert.ok(res.body.data.id);
    assert.strictEqual(res.body.data.videoUrl, 'https://www.youtube.com/watch?v=dQw4w9WgXcQ');
    assert.ok(res.body.data.content.includes('How to Apply'));
    createdProductId = res.body.data.id;
  });

  await t.test('GET /api/products - Retrieve product list including videoUrl', async () => {
    const res = await request(app).get('/api/products');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.ok(Array.isArray(res.body.data));
    const found = res.body.data.find((p) => p.id === createdProductId);
    assert.ok(found);
    assert.strictEqual(found.videoUrl, 'https://www.youtube.com/watch?v=dQw4w9WgXcQ');
  });

  await t.test('PUT /api/products/:id - Update product package', async () => {
    const res = await request(app)
      .put(`/api/products/${createdProductId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        price: 4799,
        videoUrl: 'https://www.youtube.com/watch?v=updated_video'
      });

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.strictEqual(res.body.data.price, 4799);
    assert.strictEqual(res.body.data.videoUrl, 'https://www.youtube.com/watch?v=updated_video');
  });

  await t.test('DELETE /api/products/:id - Delete created product', async () => {
    const res = await request(app)
      .delete(`/api/products/${createdProductId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
  });

  await t.test('DELETE /api/products/:id - Deleting non-existent product returns clean 404 JSON', async () => {
    const res = await request(app)
      .delete('/api/products/non-existent-product-id-9999')
      .set('Authorization', `Bearer ${adminToken}`);

    assert.strictEqual(res.status, 404);
    assert.strictEqual(res.body.success, false);
    assert.ok(res.headers['content-type'].includes('application/json'));
  });

  // 5. Blog Safe Deletion
  await t.test('DELETE /api/blogs/:id - Deleting non-existent blog returns clean 404 JSON', async () => {
    const res = await request(app)
      .delete('/api/blogs/non-existent-blog-id-9999')
      .set('Authorization', `Bearer ${adminToken}`);

    assert.strictEqual(res.status, 404);
    assert.strictEqual(res.body.success, false);
    assert.ok(res.headers['content-type'].includes('application/json'));
  });
});
