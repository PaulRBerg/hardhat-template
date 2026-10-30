import { task } from "hardhat/config";

export default task("accounts", "Prints the list of accounts")
  .setInlineAction(async (_taskArgs, hre) => {
    const { ethers } = await hre.network.create();
    const accounts = await ethers.getSigners();

    for (const account of accounts) {
      console.log(account.address);
    }
  })
  .build();
