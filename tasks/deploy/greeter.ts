import { task } from "hardhat/config";
import { TaskArguments } from "hardhat/types";

import { Greeter } from "../../src/types/Greeter";
import { Greeter__factory } from "../../src/types/factories/Greeter__factory";

task("deploy:Greeter")
  .addParam("greeting", "Say hello, be nice")
  .setAction(async function (taskArguments: TaskArguments, { ethers }) {
    const greeterFactory: Greeter__factory = <Greeter__factory>await ethers.getContractFactory("Greeter");
    const greeter: Greeter = <Greeter>await greeterFactory.deploy(taskArguments.greeting);
    await greeter.deployed();
    console.log("Greeter deployed to: ", greeter.address);
  });
