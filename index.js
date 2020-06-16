require("dotenv").config({ path: process.env.DOTENV_CONFIG_PATH });

const { promisify } = require("util");
const server = require("./services/server");
const cache = require("./services/cache");

const { HOST, PORT } = process.env;

async function start() {
  await server.listen(PORT, HOST);
}

async function stop() {
  await cache.destroy();
  await server.close();
}

module.exports = {
  logger: server.log,
  service: { start, stop },
};
