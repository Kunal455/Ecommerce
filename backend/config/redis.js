const { Redis } = require('@upstash/redis');

let redisClient;
let isRedisConnected = false;

const initRedis = async () => {
  try {
    redisClient = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL || 'https://upstash.io',
      token: process.env.UPSTASH_REDIS_REST_TOKEN || 'gQAAAAAAAoGkAAIgcDE1YTY2YjlmNTY1YjY0ZGVkOWYwNTY2NzNjMGY1OGNlZQ',
    });

    // Test the connection by running a simple GET command
    await redisClient.get('test_connection');
    console.log('Upstash Redis Client Connected'.bgGreen);
    isRedisConnected = true;
  } catch (error) {
    console.error('Failed to connect to Upstash Redis. Caching will be bypassed.'.bgRed, error);
    isRedisConnected = false;
  }
};

module.exports = {
  initRedis,
  getRedisClient: () => redisClient,
  isRedisAvailable: () => isRedisConnected
};
