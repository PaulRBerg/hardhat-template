import { loadEnvironmentFromHardhat } from "hardhat-deploy/helpers";
import { task } from "hardhat/config";

function distance(past: number, future: number): string {
  // get total seconds between the times
  let delta = future - past;

  // calculate (and subtract) whole days
  const days = Math.floor(delta / 86400);
  delta -= days * 86400;

  // calculate (and subtract) whole hours
  const hours = Math.floor(delta / 3600) % 24;
  delta -= hours * 3600;

  // calculate (and subtract) whole minutes
  const minutes = Math.floor(delta / 60) % 60;
  delta -= minutes * 60;

  // what's left is seconds
  const seconds = delta % 60; // in theory the modulus is not required

  return `${days} day(s), ${hours} hour(s), ${minutes} minute(s) and ${seconds} second(s)`;
}

export const withdraw = task("task:withdraw", "Calls the withdraw function of Lock Contract")
  .addOption({ name: "address", description: "Optionally specify the Lock address to withdraw", defaultValue: "" })
  .addOption({ name: "account", description: "Specify which account [0, 9]", defaultValue: "" })
  .setInlineAction(async (taskArguments, hre) => {
    const connection = await hre.network.create();
    const { ethers } = connection;
    const signers = await ethers.getSigners();
    const signer = taskArguments.account === "" ? undefined : signers[Number(taskArguments.account)];
    if (signer === undefined) {
      throw new Error("Specify an available account with --account [0, 9]");
    }
    const address =
      taskArguments.address || (await loadEnvironmentFromHardhat({ hre, connection })).get("Lock").address;
    const lock = await ethers.getContractAt("Lock", address);

    const initialBalance = await ethers.provider.getBalance(address);
    await (await lock.connect(signer).withdraw()).wait();
    const finalBalance = await ethers.provider.getBalance(address);

    console.log("Contract balance before withdraw", ethers.formatEther(initialBalance));
    console.log("Contract balance after withdraw", ethers.formatEther(finalBalance));
    console.log("Lock Withdraw Success");
  })
  .build();

export const deployLock = task("task:deployLock", "Deploys Lock Contract")
  .addOption({
    name: "unlock",
    description: "When to unlock funds in seconds (number of seconds into the future)",
    defaultValue: "",
  })
  .addOption({
    name: "value",
    description: "How much ether you intend locking (in ether not wei, e.g., 0.1)",
    defaultValue: "",
  })
  .setInlineAction(async (taskArguments, hre) => {
    if (taskArguments.unlock === "" || taskArguments.value === "") {
      throw new Error("Specify --unlock <seconds> and --value <ether>");
    }
    const { ethers } = await hre.network.create();
    const NOW_IN_SECONDS = Math.round(Date.now() / 1000);
    const lockedAmount = ethers.parseEther(taskArguments.value);
    const unlockTime = NOW_IN_SECONDS + parseInt(taskArguments.unlock);
    const lockFactory = await ethers.getContractFactory("Lock");
    console.log(`Deploying Lock and locking ${taskArguments.value} ETH for ${distance(NOW_IN_SECONDS, unlockTime)}`);
    const lock = await lockFactory.deploy(unlockTime, { value: lockedAmount });
    await lock.waitForDeployment();
    console.log("Lock deployed to: ", await lock.getAddress());
  })
  .build();
