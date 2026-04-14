const redisClient = require("../config/redis");

const cacheMiddleware = (keyPrefix, expirationSeconds = 3600) => {
  return async (req, res, next) => {
    const key = `${keyPrefix}:${req.originalUrl}`;

    try {
      const cachedData = await redisClient.get(key);

      if (cachedData) {
        console.log("CACHE HIT");
        return res.status(200).json(JSON.parse(cachedData));
      }

      console.log("CACHE MISS");

      const originalSend = res.send.bind(res);

      res.send = async (body) => {
        try {
          await redisClient.setEx(key, expirationSeconds, body);
        } catch (err) {
          console.log("Redis set error", err);
        }

        originalSend(body);
      };

      next();
    } catch (error) {
      console.error("Redis Cache Error:", error);
      next();
    }
  };
};

module.exports = cacheMiddleware;