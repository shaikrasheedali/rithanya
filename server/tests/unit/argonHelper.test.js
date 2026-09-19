const test = require('node:test');
const assert = require('node:assert');
const { hashPassword, verifyPassword } = require('../../utils/argonHelper');

test('Password Hashing & Verification Helper', async (t) => {
  await t.test('should hash and verify password correctly', async () => {
    const password = 'SecureStaffPassword@2026!';
    const hashed = await hashPassword(password);

    assert.ok(typeof hashed === 'string');
    assert.notStrictEqual(hashed, password);

    const isMatch = await verifyPassword(password, hashed);
    assert.strictEqual(isMatch, true);

    const isWrong = await verifyPassword('WrongPassword123', hashed);
    assert.strictEqual(isWrong, false);
  });

  await t.test('should handle legacy sha256 hex compatibility', async () => {
    const crypto = require('crypto');
    const legacy = 'Hameed@2026';
    const sha = crypto.createHash('sha256').update(legacy).digest('hex');

    const isMatch = await verifyPassword(legacy, sha);
    assert.strictEqual(isMatch, true);
  });
});
