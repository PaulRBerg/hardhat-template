import { task } from "hardhat/config";
import type { TaskArguments } from "hardhat/types";

task("task:deployGreeter")
  .addParam("greeting", "Say hello, be nice")
  .setAction(async function (taskArguments: TaskArguments, { ethers }) {
    const signers = await ethers.getSigners();
    const greeterFactory = await ethers.getContractFactory("Greeter");
    const greeter = await greeterFactory.connect(signers[0]).deploy(taskArguments.greeting);
    await greeter.waitForDeployment();
    console.log("Greeter deployed to: ", await greeter.getAddress());
  });
