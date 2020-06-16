const { promisify } = require("util");
const createHttpError = require("http-errors");

const Pool = require("../structs/Pool");
const cache = require("./cache");

const REQUEST_POOL_SIZE = Number.parseInt(process.env.REQUEST_POOL_SIZE, 10);

const pool = new Pool(REQUEST_POOL_SIZE);

module.exports = ({ params }, res) => {
  return pool.run(async () => {
    const key = params["*"].slice(1);
    const value = await cache.read(key);
    if (value === null) {
      res.status(404);
      return createHttpError(404);
    }
    res.status(200);
    res.type("text/plain");
    return value;
  });
};
