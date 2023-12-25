import { task } from "hardhat/config";
import type { TaskArguments } from "hardhat/types";

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

task("task:withdraw", "Calls the withdraw function of Lock Contract")
  .addOptionalParam("address", "Optionally specify the Lock address to withdraw")
  .addParam("account", "Specify which account [0, 9]")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const { ethers, deployments } = hre;

    const Lock = taskArguments.address ? { address: taskArguments.address } : await deployments.get("Lock");

    const signers = await ethers.getSigners();
    console.log(taskArguments.address);

    const lock = await ethers.getContractAt("Lock", Lock.address);

    const initialBalance = await ethers.provider.getBalance(Lock.address);
    await lock.connect(signers[taskArguments.account]).withdraw();
    const finalBalance = await ethers.provider.getBalance(Lock.address);

    console.log("Contract balance before withdraw", ethers.formatEther(initialBalance));
    console.log("Contract balance after withdraw", ethers.formatEther(finalBalance));

    console.log("Lock Withdraw Success");
  });

task("task:deployLock", "Deploys Lock Contract")
  .addParam("unlock", "When to unlock funds in seconds (number of seconds into the futrue)")
  .addParam("value", "How much ether you intend locking (in ether not wei, e.g., 0.1)")
  .setAction(async function (taskArguments: TaskArguments, { ethers }) {
    const NOW_IN_SECONDS = Math.round(Date.now() / 1000);

    const signers = await ethers.getSigners();
    const lockedAmount = ethers.parseEther(taskArguments.value);
    const unlockTime = NOW_IN_SECONDS + parseInt(taskArguments.unlock);
    const lockFactory = await ethers.getContractFactory("Lock");
    console.log(`Deploying Lock and locking ${taskArguments.value} ETH for ${distance(NOW_IN_SECONDS, unlockTime)}`);
    const lock = await lockFactory.connect(signers[0]).deploy(unlockTime, { value: lockedAmount });
    await lock.waitForDeployment();
    console.log("Lock deployed to: ", await lock.getAddress());
  });
