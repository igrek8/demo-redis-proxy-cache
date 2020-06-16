const { service } = require("./");

module.exports = async ({ watch }) => {
  if (watch) return;
  await service.stop();
};
