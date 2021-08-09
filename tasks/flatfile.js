const { task } = require("hardhat/config");
const fs = require("fs");
const { execSync } = require("child_process");
const { log } = require("../utils/utils.js");
const { pascalCase } = require("../utils/string-utils.js");

// e.g. npx hardhat flatfile --contract TestingContract
task("flatfile", "Creates a flattened sol file")
  .addParam("contract", "Contract name")
  .setAction(async (taskArgs) => {
    // log("taskArgs", taskArgs);
    const { contract } = taskArgs;
    // log("contract", contract);

    const output = execSync(
      `npx hardhat flatten contracts/${contract}.sol`
    ).toString();
    console.log(output);

    let filename = pascalCase(contract);
    // log("filename", filename);

    let path = `flattened/${filename}`;
    fs.writeFileSync(path + ".txt", output);

    console.log(`Flattened file created at ${path}.txt`);
  });
