import { Signer } from "@ethersproject/abstract-signer";
import { task } from "@nomiclabs/buidler/config";

import { TASK_ACCOUNTS } from "./task-names";

task(TASK_ACCOUNTS, "Prints the list of accounts", async (_taskArgs, bre) => {
  const accounts: Signer[] = await bre.ethers.getSigners();

  for (const account of accounts) {
    console.log(await account.getAddress());
  }
});
