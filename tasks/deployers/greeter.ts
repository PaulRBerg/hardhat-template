import { task } from "hardhat/config";
import { TaskArguments } from "hardhat/types";

import { Greeter, Greeter__factory } from "../../typechain";

task("deploy:Greeter")
  .addParam("greeting", "Say hello, be nice")
  .setAction(async function (taskArguments: TaskArguments, { ethers, network, run }) {
    const greeterFactory: Greeter__factory = await ethers.getContractFactory("Greeter");
    const greeter: Greeter = <Greeter>await greeterFactory.deploy(taskArguments.greeting);
    await greeter.deployed();
    console.log("Greeter deployed to: ", greeter.address);

    if (network.name !== "hardhat") {
      await run("verify:verify", {
        address: greeter.address,
        constructorArguments: [taskArguments.greeting],
      });
    }
  });
