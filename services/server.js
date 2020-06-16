const path = require("path");
const fastify = require("fastify");
const helmet = require("fastify-helmet");

const server = fastify({ logger: process.env.NODE_ENV !== "test" });

server.register(helmet);
server.get("*", require("./proxy"));

module.exports = server;
