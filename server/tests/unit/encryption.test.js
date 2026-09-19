const test = require('node:test');
const assert = require('node:assert');
const { encrypt, decrypt, hashBlind } = require('../../utils/encryption');

test('AES-256-GCM Encryption & Decryption', async (t) => {
  await t.test('should encrypt plaintext into four-part format (salt:iv:tag:ciphertext)', () => {
    const secret = 'Patient Confidential Diagnosis: Beta Thalassemia Major';
    const ciphertext = encrypt(secret);

    assert.ok(ciphertext.includes(':'));
    const parts = ciphertext.split(':');
    assert.strictEqual(parts.length, 4);
    assert.notStrictEqual(ciphertext, secret);
  });

  await t.test('should correctly decrypt back to original plaintext', () => {
    const original = 'Aadhaar: 1234-5678-9012';
    const ciphertext = encrypt(original);
    const decrypted = decrypt(ciphertext);

    assert.strictEqual(decrypted, original);
  });

  await t.test('should produce deterministic blind hashes for confidential lookup', () => {
    const phone = '+91 98481 22334';
    const hash1 = hashBlind(phone);
    const hash2 = hashBlind(phone);

    assert.strictEqual(hash1, hash2);
    assert.strictEqual(hash1.length, 64);
  });
});
