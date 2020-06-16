const { once } = require("events");
const { promisify } = require("util");

const lru = require("./lru");
const redis = require("./redis");

/**
 * Closes redis connection
 */
async function destroy() {
  await redis.quit();
  lru.clear();
}

/**
 * Reads from the local cache and fallbacks to Redis
 * @param {string} key
 */
async function read(key) {
  let value = lru.read(key);
  if (value === null) {
    try {
      // redis connection can be broken
      value = await redis.get(key);
      if (value !== null) lru.write(key, value);
    } catch {}
  }
  return value;
}

module.exports = { read, destroy };
