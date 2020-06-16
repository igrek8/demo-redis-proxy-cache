const LRU = require("../structs/LRU");

const LRU_CAPACITY = Number.parseInt(process.env.LRU_CAPACITY, 10);
const LRU_TTL = Number.parseInt(process.env.LRU_TTL, 10);

const lru = new LRU({ ttl: LRU_TTL, capacity: LRU_CAPACITY });

module.exports = lru;
