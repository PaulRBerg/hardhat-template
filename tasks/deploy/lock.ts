import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { task } from "hardhat/config";
import type { TaskArguments } from "hardhat/types";

import type { Lock__factory } from "../../types/";

task("deploy:Lock")
  .addParam("unlockTime", "The contract unlocked time.", new Date().getTime() + "")
  .setAction(async function (taskArguments: TaskArguments, { ethers }) {
    const signers: SignerWithAddress[] = await ethers.getSigners();
    const lockFactory: Lock__factory = <Lock__factory>await ethers.getContractFactory("Greeter");
    const lock = await lockFactory.connect(signers[0]).deploy(taskArguments.unlockTime);
    await lock.deployed();
    console.log("Lock deployed to: ", lock.address);
  });
