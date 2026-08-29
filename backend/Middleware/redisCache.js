const { getRedisClient, isRedisAvailable } = require('../config/redis');

/**
 * Express middleware to cache responses in Redis
 * @param {number} duration - Expiration time in seconds
 */
const cacheFilters = (duration = 3600) => {
  return async (req, res, next) => {
    // If Redis isn't connected, bypass caching
    if (!isRedisAvailable()) {
      return next();
    }

    const redisClient = getRedisClient();
    const key = `cache:${req.originalUrl || req.url}`;

    try {
      if (req.perf) req.perf.steps.redis_start = performance.now();
      
      const cachedData = await redisClient.get(key);
      
      if (req.perf) {
        req.perf.steps.redis_duration = performance.now() - req.perf.steps.redis_start;
        req.perf.steps.cache_status = cachedData ? 'HIT' : 'MISS';
      }

      if (cachedData) {
        if (req.perf && process.env.PERF_LOG === 'true') {
          const totalDuration = performance.now() - req.perf.start;
          const threshold = Number(process.env.PERF_SLOW_THRESHOLD) || 0;
          if (totalDuration >= threshold) {
            const serverId = process.env.HOSTNAME || process.pid;
            console.log(`[PERF] request_start method=${req.method} path=${req.originalUrl || req.url} requestId=${req.requestId}`);
            console.log(`[PERF] server=${serverId}`);
            console.log(`[PERF] redis_get=${req.perf.steps.redis_duration.toFixed(2)}ms cache=HIT`);
            console.log(`[PERF] total=${totalDuration.toFixed(2)}ms`);
            console.log(`[PERF] request_end status=200 total=${totalDuration.toFixed(2)}ms`);
          }
        }
        // Send cached response
        return res.status(200).json(typeof cachedData === 'string' ? JSON.parse(cachedData) : cachedData);
      }

      // Intercept res.json to cache the response before sending it
      const originalJson = res.json;
      res.json = function (body) {
        // Store in Redis with expiration
        redisClient.set(key, JSON.stringify(body), { EX: duration })
          .catch(err => console.error('Redis caching error:', err));
        
        // Call the original res.json
        originalJson.call(this, body);
      };

      next();
    } catch (error) {
      console.error('Redis middleware error:', error);
      next();
    }
  };
};

const invalidateProductCache = async () => {
  if (!isRedisAvailable()) return;
  const redisClient = getRedisClient();
  try {
    let keys = await redisClient.keys('cache:/api/v3/product*');
    if (keys.length > 0) {
      await redisClient.del(...keys);
    }
  } catch (error) {
    console.error('Redis cache invalidation error:', error);
  }
};

module.exports = { cacheFilters, invalidateProductCache };
