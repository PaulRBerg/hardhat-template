import { Signer } from "@ethersproject/abstract-signer";
import { task } from "@nomiclabs/buidler/config";

task("accounts", "Prints the list of accounts", async (_taskArgs, bre) => {
  const accounts: Signer[] = await bre.ethers.getSigners();

  for (const account of accounts) {
    console.log(await account.getAddress());
  }
});
