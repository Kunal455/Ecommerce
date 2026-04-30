const { createClient } = require('redis');

let redisClient;
let isRedisConnected = false;

const initRedis = async () => {
  redisClient = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379'
  });

  redisClient.on('error', (err) => {
    console.error('Redis Client Error:', err);
    isRedisConnected = false;
  });

  redisClient.on('connect', () => {
    console.log('Redis Client Connected'.bgGreen);
    isRedisConnected = true;
  });

  try {
    await redisClient.connect();
  } catch (error) {
    console.error('Failed to connect to Redis. Caching will be bypassed.'.bgRed);
  }
};

module.exports = {
  initRedis,
  getRedisClient: () => redisClient,
  isRedisAvailable: () => isRedisConnected
};
