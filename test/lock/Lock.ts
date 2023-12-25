import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { loadFixture, time } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

import type { Signers } from "../types";
import { deployLockFixture } from "./Lock.fixture";

describe("Lock", function () {
  before(async function () {
    this.signers = {} as Signers;

    const signers = await ethers.getSigners();
    this.signers.admin = signers[0];

    this.loadFixture = loadFixture;
  });

  describe("Deployment", function () {
    beforeEach(async function () {
      const { lock, lock_address, unlockTime, owner, lockedAmount } = await this.loadFixture(deployLockFixture);
      this.lock = lock;
      this.lock_address = lock_address;
      this.unlockTime = unlockTime;
      this.owner = owner;
      this.lockedAmount = lockedAmount;
    });

    it("Should fail if the unlockTime is not in the future", async function () {
      // We don't use the fixture here because we want a different deployment
      const latestTime = await time.latest();
      const Lock = await ethers.getContractFactory("Lock");
      await expect(Lock.deploy(latestTime, { value: 1 })).to.be.revertedWithCustomError(Lock, "InvalidUnlockTime");
    });

    it("Should set the right unlockTime", async function () {
      expect(await this.lock.unlockTime()).to.equal(this.unlockTime);
    });

    it("Should set the right owner", async function () {
      expect(await this.lock.owner()).to.equal(this.owner.address);
    });

    it("Should receive and store the funds to lock", async function () {
      expect(await ethers.provider.getBalance(this.lock_address)).to.equal(this.lockedAmount);
    });
  });

  describe("Withdrawals", function () {
    beforeEach(async function () {
      const { lock, unlockTime, owner, lockedAmount, otherAccount } = await this.loadFixture(deployLockFixture);
      this.lock = lock;
      this.unlockTime = unlockTime;
      this.owner = owner;
      this.lockedAmount = lockedAmount;
      this.otherAccount = otherAccount;
    });

    describe("Validations", function () {
      it("Should revert with the right error if called too soon", async function () {
        await expect(this.lock.withdraw()).to.be.revertedWithCustomError(this.lock, "UnlockTimeNotReached");
      });

      it("Should revert with the right error if called from another account", async function () {
        // We can increase the time in Hardhat Network
        await time.increaseTo(this.unlockTime);

        // We use lock.connect() to send a transaction from another account
        await expect(this.lock.connect(this.otherAccount).withdraw()).to.be.revertedWithCustomError(
          this.lock,
          "NotOwner",
        );
      });

      it("Shouldn't fail if the unlockTime has arrived and the owner calls it", async function () {
        // Transactions are sent using the first signer by default
        await time.increaseTo(this.unlockTime);

        await expect(this.lock.withdraw()).not.to.be.reverted;
      });
    });

    describe("Events", function () {
      it("Should emit an event on withdrawals", async function () {
        await time.increaseTo(this.unlockTime);

        await expect(this.lock.withdraw()).to.emit(this.lock, "Withdrawal").withArgs(this.lockedAmount, anyValue); // We accept any value as `when` arg
      });
    });

    describe("Transfers", function () {
      it("Should transfer the funds to the owner", async function () {
        await time.increaseTo(this.unlockTime);

        await expect(this.lock.withdraw()).to.changeEtherBalances(
          [this.owner, this.lock],
          [this.lockedAmount, -this.lockedAmount],
        );
      });
    });
  });
});
