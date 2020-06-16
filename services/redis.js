const Redis = require("ioredis");

const REDIS_HOST = process.env.REDIS_HOST;
const REDIS_PORT = Number.parseInt(process.env.REDIS_PORT, 10);

const redis = new Redis({
  host: REDIS_HOST,
  port: REDIS_PORT,
});

module.exports = redis;
