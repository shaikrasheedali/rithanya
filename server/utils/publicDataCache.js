/**
 * Ultra-Fast In-Memory Unencrypted Public Data Cache
 * Serves public hospital resources (Services, Treatments, Doctors, Products, Gallery, Insights)
 * in sub-millisecond time without encryption overhead or remote database transit latency.
 */

const cacheStore = new Map();
const DEFAULT_TTL_MS = 5 * 60 * 1000; // 5 minutes

function getPublicCache(key) {
  const entry = cacheStore.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    cacheStore.delete(key);
    return null;
  }
  return entry.data;
}

function setPublicCache(key, data, ttlMs = DEFAULT_TTL_MS) {
  cacheStore.set(key, {
    data,
    expiresAt: Date.now() + ttlMs
  });
}

function invalidatePublicCache(prefix) {
  if (!prefix) {
    cacheStore.clear();
    return;
  }
  for (const key of cacheStore.keys()) {
    if (key.startsWith(prefix)) {
      cacheStore.delete(key);
    }
  }
}

function clearAllPublicCache() {
  cacheStore.clear();
}

module.exports = {
  getPublicCache,
  setPublicCache,
  invalidatePublicCache,
  clearAllPublicCache
};
