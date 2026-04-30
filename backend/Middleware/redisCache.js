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
      const cachedData = await redisClient.get(key);
      if (cachedData) {
        // Send cached response
        return res.status(200).json(JSON.parse(cachedData));
      }

      // Intercept res.json to cache the response before sending it
      const originalJson = res.json;
      res.json = function (body) {
        // Store in Redis with expiration
        redisClient.setEx(key, duration, JSON.stringify(body))
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

module.exports = { cacheFilters };
