import { Contract } from "ethers";
// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
// When running the script with `hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";

import { Greeter__factory } from "../typechain";

async function main(): Promise<void> {
  const Greeter: Greeter__factory = await ethers.getContractFactory("Greeter");
  const greeter: Contract = await Greeter.deploy("Hello, Buidler!");
  await greeter.deployed();

  console.log("Greeter deployed to: ", greeter.address);
}

// We recommend this pattern to be able to use async/await everywhere and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error: Error) => {
    console.error(error);
    process.exit(1);
  });
