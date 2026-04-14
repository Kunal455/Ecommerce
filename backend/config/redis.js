const redis = require("redis");
const colors = require('colors');
require("dotenv").config();
const redisClient = redis.createClient({
  url: process.env.REDIS_URL || "redis://127.0.0.1:6379",
});

redisClient.on("error", (err) => console.log("Redis Client Error", err));
redisClient.on("connect", () => console.log("Connected to Redis".bgMagenta));

async function connectRedis() {
  try {
    await redisClient.connect();
    
  } catch (err) {
    console.log("Redis connection failed", err);
  }
}

connectRedis();


module.exports = redisClient;