import { artifacts, deployScript } from "../rocketh/deploy.js";

export default deployScript(
  async ({ deploy, namedAccounts }) => {
    const DAY_IN_SECONDS = 60 * 60 * 24;
    const unlockTime = Math.round(Date.now() / 1000) + DAY_IN_SECONDS;
    const lock = await deploy("Lock", {
      account: namedAccounts.deployer,
      artifact: artifacts.Lock,
      args: [BigInt(unlockTime)],
      value: 10n ** 16n,
    });

    console.log("Lock contract: ", lock.address);
  },
  { id: "deploy_lock", tags: ["Lock"] },
);
