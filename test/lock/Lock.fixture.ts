import { time } from "@nomicfoundation/hardhat-network-helpers";
import { ethers } from "hardhat";

import { Lock__factory } from "../../types/";

export async function deployOneYearLockFixture() {
  const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60;
  const ONE_GWEI = 1_000_000_000;

  const lockedAmount = ONE_GWEI;
  const unlockTime = (await time.latest()) + ONE_YEAR_IN_SECS;

  // Contracts are deployed using the first signer/account by default
  const [owner, otherAccount] = await ethers.getSigners();

  const Lock = (await ethers.getContractFactory("Lock")) as Lock__factory;
  const lock = await Lock.deploy(unlockTime, { value: lockedAmount });

  return { lock, unlockTime, lockedAmount, owner, otherAccount };
}
