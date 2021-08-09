const shell = require("shelljs");

module.exports = {
  istanbulReporter: ["html", "lcov"],
  onIstanbulComplete: async function (_config) {
    // We need to do this because solcover generates bespoke artifacts.
    shell.rm("-rf", "./artifacts");
  },
  skipFiles: ["mocks", "test"],
};
