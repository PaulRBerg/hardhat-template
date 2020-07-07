const shell = require("shelljs");

module.exports = {
  istanbulReporter: ["html"],
  mocha: {
    delay: true,
  },
  onCompileComplete: async function (_config) {
    await run("typechain");
  },
  onIstanbulComplete: async function (_config) {
    shell.rm("-rf", "./typechain");
  },
  skipFiles: ["mocks", "test"],
};
