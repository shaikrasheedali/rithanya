const test = require('node:test');
const assert = require('node:assert');
const { requireRoles, requirePermission } = require('../../middlewares/rbacMiddleware');

test('RBAC Middleware Permissions Matrix', async (t) => {
  await t.test('requireRoles should allow matching roles', () => {
    const middleware = requireRoles('SUPERADMIN', 'ADMIN');
    let calledNext = false;
    const req = { user: { role: 'SUPERADMIN' } };
    const res = {};
    const next = () => { calledNext = true; };

    middleware(req, res, next);
    assert.strictEqual(calledNext, true);
  });

  await t.test('requireRoles should reject non-matching roles', () => {
    const middleware = requireRoles('SUPERADMIN');
    let statusCode = 0;
    let resJson = null;
    const req = { user: { role: 'STAFF' } };
    const res = {
      status(code) {
        statusCode = code;
        return { json: (j) => { resJson = j; } };
      }
    };
    const next = () => {};

    middleware(req, res, next);
    assert.strictEqual(statusCode, 403);
    assert.strictEqual(resJson.success, false);
  });

  await t.test('requirePermission should allow superadmin and admin unconditionally', () => {
    const middleware = requirePermission('finance');
    let calledNext = false;
    const req = { user: { role: 'ADMIN', permissions: {} } };
    const res = {};
    const next = () => { calledNext = true; };

    middleware(req, res, next);
    assert.strictEqual(calledNext, true);
  });

  await t.test('requirePermission should check staff permissions map', () => {
    const middleware = requirePermission('inventory');
    let calledNext = false;
    const req = { user: { role: 'STAFF', permissions: { inventory: true } } };
    const res = {};
    const next = () => { calledNext = true; };

    middleware(req, res, next);
    assert.strictEqual(calledNext, true);
  });
});
