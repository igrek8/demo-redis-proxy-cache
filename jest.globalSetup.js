const { service } = require("./");

let isRunning = false;

module.exports = async (config) => {
  if (!isRunning) {
    await service.start();
    isRunning = true;
  }
};
