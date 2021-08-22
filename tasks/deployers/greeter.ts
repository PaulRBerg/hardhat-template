import { task } from "hardhat/config";
import { TaskArguments } from "hardhat/types";

import { Greeter, Greeter__factory } from "../../typechain";

import { execSync } from "child_process";

task("deploy:Greeter")
  .addParam("greeting", "Say hello, be nice")
  .setAction(async function (taskArguments: TaskArguments, { ethers }) {
    const { name } = await ethers.provider.getNetwork();
    const greeterFactory: Greeter__factory = await ethers.getContractFactory("Greeter");
    const greeter: Greeter = <Greeter>await greeterFactory.deploy(taskArguments.greeting);
    await greeter.deployed();
    console.log("Greeter deployed to: ", greeter.address);

    if (name !== "unknown") {
      execSync(`npx hardhat verify --network ${name} ${greeter.address} ${taskArguments.greeting}`, {
        stdio: "inherit",
      });
    }
  });
