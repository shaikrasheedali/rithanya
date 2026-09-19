let argon2 = null;
try {
  argon2 = require('argon2');
} catch (e) {
  // Graceful fallback if native module builds during npm install
}

const crypto = require('crypto');

async function hashPassword(plainPassword) {
  if (argon2) {
    try {
      return await argon2.hash(plainPassword, {
        type: argon2.argon2id,
        memoryCost: 2 ** 16,
        timeCost: 3,
        parallelism: 1
      });
    } catch (e) {
      // fallback
    }
  }
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(plainPassword, salt, 100000, 64, 'sha512').toString('hex');
  return `$pbkdf2$${salt}$${hash}`;
}

async function verifyPassword(plainPassword, storedHash) {
  if (!storedHash) return false;

  if (storedHash.startsWith('$argon2') && argon2) {
    try {
      return await argon2.verify(storedHash, plainPassword);
    } catch (err) {
      // fallback
    }
  }

  if (storedHash.startsWith('$pbkdf2$')) {
    const parts = storedHash.split('$');
    const salt = parts[2];
    const hash = parts[3];
    const computed = crypto.pbkdf2Sync(plainPassword, salt, 100000, 64, 'sha512').toString('hex');
    return computed === hash;
  }

  // SHA256 hex compatibility for seed legacy hashes
  const sha = crypto.createHash('sha256').update(plainPassword).digest('hex');
  if (sha === storedHash) return true;

  return plainPassword === storedHash;
}

module.exports = {
  hashPassword,
  verifyPassword
};
