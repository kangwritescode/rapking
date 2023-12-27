// lib/redis.js
import Redis from 'ioredis';

const redis = new Redis({
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT)
});
module.exports = redis;
