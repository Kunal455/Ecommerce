const { createClient } = require('redis');

let redisClient;
let isRedisConnected = false;

const initRedis = async () => {
  try {
    const startCreate = performance.now();
    redisClient = createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379'
    });

    redisClient.on('error', (err) => {
      console.error('[REDIS ERROR] Redis Client Error', err);
      isRedisConnected = false;
    });

    redisClient.on('connect', () => {
      if (process.env.PERF_LOG === 'true') {
        console.log(`[PERF] Redis connection established in ${(performance.now() - startCreate).toFixed(2)}ms`);
      }
    });

    redisClient.on('ready', () => {
      isRedisConnected = true;
      console.log('Local TCP Redis Client Connected & Ready'.bgGreen);
    });

    redisClient.on('reconnecting', () => {
      console.log('[REDIS] Reconnecting...');
    });

    const startConnect = performance.now();
    await redisClient.connect();
    
    if (process.env.PERF_LOG === 'true') {
      console.log(`[PERF] await redisClient.connect() took ${(performance.now() - startConnect).toFixed(2)}ms`);
    }

    // Test the connection by running a simple GET command
    const startTest = performance.now();
    await redisClient.get('test_connection');
    if (process.env.PERF_LOG === 'true') {
      console.log(`[PERF] Redis initial test GET took ${(performance.now() - startTest).toFixed(2)}ms`);
    }
  } catch (error) {
    console.error('Failed to connect to Redis. Caching will be bypassed.'.bgRed, error);
    isRedisConnected = false;
  }
};

module.exports = {
  initRedis,
  getRedisClient: () => redisClient,
  isRedisAvailable: () => isRedisConnected
};
