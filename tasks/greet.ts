import { task } from "hardhat/config";
import type { TaskArguments } from "hardhat/types";

task("task:setGreeting")
  .addParam("greeting", "Say hello, be nice")
  .addParam("account", "Specify which account [0, 9]")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const { ethers, deployments } = hre;

    const Greeter = await deployments.get("Greeter");

    const signers = await ethers.getSigners();

    const greeter = await ethers.getContractAt("Greeter", Greeter.address);

    await greeter.connect(signers[taskArguments.account]).setGreeting(taskArguments.greeting);

    console.log("Greeting set: ", taskArguments.greeting);
  });
