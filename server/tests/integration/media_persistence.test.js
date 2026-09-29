const { test, describe, before } = require('node:test');
const assert = require('node:assert');
const request = require('supertest');
const path = require('path');
const fs = require('fs');
const { app } = require('../../index');
const prisma = require('../../config/db');
const { sanitizeDatabaseAssets } = require('../../utils/sanitizeAssets');

describe('Media Persistence, Dynamic Route Serving & Sanitizer Suite', () => {
  let superadminToken;
  let testAssetId;
  const testFilename = `test-persistent-asset-${Date.now()}.png`;

  before(async () => {
    // 1. Authenticate as admin
    let loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin@rithanyahospital.com',
        password: 'Admin@2026'
      });

    if (!loginRes.body?.token) {
      loginRes = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'superadmin@rithanya.org',
          password: 'ChangeMeSuperAdmin2026!'
        });
    }

    if (loginRes.body && loginRes.body.token) {
      superadminToken = loginRes.body.token;
    }

    // 2. Seed a test MediaAsset directly in DB with base64 fileData
    const dummyBuffer = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', 'base64');
    const asset = await prisma.mediaAsset.create({
      data: {
        filename: testFilename,
        originalName: '1x1-test.png',
        mimeType: 'image/png',
        size: dummyBuffer.length,
        url: `/assets/uploads/${testFilename}`,
        fileData: dummyBuffer.toString('base64')
      }
    });
    testAssetId = asset.id;
  });

  test('GET /api/media/file/:id - Public dynamic route serves image without authentication', async () => {
    const res = await request(app).get(`/api/media/file/${testAssetId}`);
    assert.strictEqual(res.status, 200);
    const contentType = res.header['content-type'] || res.get('Content-Type') || '';
    assert.ok(contentType.includes('image/png'));
    assert.ok(res.body.length > 0 || res.text.length > 0);
  });

  test('GET /api/media/file/:filename - Public dynamic route serves by filename', async () => {
    const res = await request(app).get(`/api/media/file/${testFilename}`);
    assert.strictEqual(res.status, 200);
    const contentType = res.header['content-type'] || res.get('Content-Type') || '';
    assert.ok(contentType.includes('image/png'));
  });

  test('GET /api/media/file/non-existent-id - Resilient fallback returns 200 OK without 404/500 error', async () => {
    const res = await request(app).get('/api/media/file/definitely-non-existent-uuid-9999');
    assert.strictEqual(res.status, 200);
    const contentType = res.header['content-type'] || res.get('Content-Type') || '';
    assert.ok(contentType.includes('image/png') || contentType.includes('image/svg+xml'));
  });

  test('GET /assets/uploads/:filename - Server fallback returns 200 OK for missing assets', async () => {
    const res = await request(app).get('/assets/uploads/missing-image-12345.jpg');
    assert.strictEqual(res.status, 200);
    const contentType = res.header['content-type'] || res.get('Content-Type') || '';
    assert.ok(contentType.includes('image/png') || contentType.includes('image/svg+xml'));
  });

  test('GET /api/media/assets - Returns canonical persistent URLs for Media Library picker', async () => {
    if (!superadminToken) return;
    const res = await request(app)
      .get('/api/media/assets')
      .set('Authorization', `Bearer ${superadminToken}`);

    assert.strictEqual(res.status, 200);
    const assets = res.body.assets || res.body.data?.uploaded || [];
    assert.ok(Array.isArray(assets));
    if (assets.length > 0) {
      const first = assets[0];
      assert.ok(first.url && (first.url.startsWith('/') || first.url.startsWith('http')));
      assert.ok(first.fileUrl && first.fileUrl.startsWith('/api/media/file/'));
      assert.strictEqual(first.fileData, undefined, 'fileData must be omitted from media assets listing to prevent latency');
    }
  });

  test('POST /api/media/upload - Real raster image is compressed and converted to WebP', async () => {
    if (!superadminToken) return;
    const realPngBuffer = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', 'base64');
    const res = await request(app)
      .post('/api/media/upload')
      .set('Authorization', `Bearer ${superadminToken}`)
      .attach('file', realPngBuffer, 'sample_doctor_portrait.png');

    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.body.success, true);
    assert.ok(res.body.url.endsWith('.webp'), 'Image asset URL must end in .webp');
    assert.strictEqual(res.body.data.mimeType, 'image/webp', 'MimeType must be image/webp');
    assert.strictEqual(res.body.data.fileData, undefined, 'Response payload must omit heavy base64 fileData');

    // Clean up
    if (res.body.data.id) {
      await prisma.mediaAsset.delete({ where: { id: res.body.data.id } }).catch(() => {});
    }
  });

  test('POST /api/media/sync - Manual disk sync completes and returns syncedCount', async () => {
    if (!superadminToken) return;
    const res = await request(app)
      .post('/api/media/sync')
      .set('Authorization', `Bearer ${superadminToken}`);

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.strictEqual(typeof res.body.syncedCount, 'number');
  });

  test('Database Startup Sanitizer - Executes cleanly and audits image fields', async () => {
    const report = await sanitizeDatabaseAssets();
    assert.strictEqual(report.success, true);
    assert.strictEqual(typeof report.rehydratedCount, 'number');
    assert.strictEqual(typeof report.sanitizedCount, 'number');
  });

  test('Clean up test media asset', async () => {
    if (testAssetId) {
      await prisma.mediaAsset.delete({ where: { id: testAssetId } }).catch(() => {});
      // Also delete from disk if created
      const uploadPath = path.join(__dirname, '../../../client/public/assets/uploads', testFilename);
      if (fs.existsSync(uploadPath)) {
        try { fs.unlinkSync(uploadPath); } catch (_) {}
      }
    }
  });
});
