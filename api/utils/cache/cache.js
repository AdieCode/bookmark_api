const { LRUCache } = require("lru-cache");
const cacheConfig = global.config.cache;

const isCacheEnabled = cacheConfig.enabled ?? true; // default: true

if (!isCacheEnabled) {
  console.log('⚠️ Cache is disabled by configuration.');

  // Return a dummy cache that does nothing
  const dummyCache = {
    get: () => undefined,
    set: () => {},
    delete: () => {},
    has: () => false,
  };

  module.exports = dummyCache;
} else {
  const ttl = cacheConfig.expirationMinutes * 60 * 1000;

  const options = {
    max: cacheConfig.size,
    ttl: ttl,
    updateAgeOnGet: cacheConfig.ResetTtlPerAccess,
  };

  const cache = new LRUCache(options);
  console.log('✅ Cache initialized with options:', options);

  module.exports = cache;
}
