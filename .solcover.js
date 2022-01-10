const shell = require("shelljs");

module.exports = {
  istanbulReporter: ["cobertura"],
  providerOptions: {
    mnemonic: process.env.MNEMONIC,
  },
  skipFiles: ["test"],
};
